// Adapted from https://github.com/tldraw/tldraw-yjs-example

import {
  InstancePresenceRecordType,
  computed,
  createPresenceStateDerivation,
  createTLStore,
  defaultShapeUtils,
  defaultUserPreferences,
  getUserPreferences,
  react,
  transact,
} from '@tldraw/tldraw';
import type { TLAnyShapeUtilConstructor, TLInstancePresence, TLRecord, TLStoreWithStatus } from '@tldraw/tldraw';
import { useEffect, useMemo, useState } from 'react';
import { YKeyValue } from 'y-utility/y-keyvalue';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';
import { DEFAULT_STORE } from './defaultStore';

interface YjsState {
  roomId: string;
  hostUrl?: string;
  shapeUtils?: TLAnyShapeUtilConstructor[];
  version?: number;
}

interface Awareness {
  id: string;
  color: string;
  name: string;
}

type yStoreChanges = Map<
  string,
  | { action: 'delete'; oldValue: TLRecord }
  | { action: 'update'; oldValue: TLRecord; newValue: TLRecord }
  | { action: 'add'; newValue: TLRecord }
>;

export const useYjsStore = ({
  roomId,
  hostUrl = process.env.REACT_APP_COLLABORATION_SERVICE_WEBSOCKET_BACKEND_URL as string,
  shapeUtils = [],
}: YjsState): TLStoreWithStatus => {
  const [storeWithStatus, setStoreWithStatus] = useState<TLStoreWithStatus>({ status: 'loading' });
  const [store] = useState(() => {
    const store = createTLStore({ shapeUtils: [...defaultShapeUtils, ...shapeUtils] });
    store.loadSnapshot(DEFAULT_STORE);
    return store;
  });

  const { yDoc, yStore, room } = useMemo(() => {
    const yDoc = new Y.Doc({ gc: true });
    const yArr = yDoc.getArray<{ key: string; val: TLRecord }>(`tl_${roomId}`);
    const yStore = new YKeyValue(yArr);
    return { yDoc, yStore, room: new WebsocketProvider(hostUrl, roomId, yDoc, { connect: true }) };
  }, [hostUrl, roomId]);

  useEffect(() => {
    setStoreWithStatus({ status: 'loading' });

    const unsubs: Array<() => void> = [];

    const handleSync = (): void => {
      // 1. Connect store to yjs store and vice versa, for both the document and awareness
      /* -------------------- Document -------------------- */
      // Sync store changes to the yjs document
      unsubs.push(
        store.listen(
          ({ changes }) => {
            yDoc.transact(() => {
              Object.values(changes.added).forEach((record) => yStore.set(record.id, record));
              Object.values(changes.updated).forEach(([_, record]) => yStore.set(record.id, record));
              Object.values(changes.removed).forEach((record) => yStore.delete(record.id));
            });
          },
          { source: 'user', scope: 'document' }, // Only sync user's document changes
        ),
      );

      // Sync the yjs doc changes to the store
      const handleChange = (changes: yStoreChanges, transaction: Y.Transaction): void => {
        if (transaction.local) return;

        const toRemove: Array<TLRecord['id']> = [];
        const toPut: TLRecord[] = [];

        changes.forEach((change, id) => {
          switch (change.action) {
            case 'add':
            case 'update': {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const record = yStore.get(id)!;
              toPut.push(record);
              break;
            }
            case 'delete': {
              toRemove.push(id as TLRecord['id']);
              break;
            }
          }
        });

        // Put / remove the records in the store
        store.mergeRemoteChanges(() => {
          if (toRemove.length !== 0) store.remove(toRemove);
          if (toPut.length !== 0) store.put(toPut);
        });
      };

      yStore.on('change', handleChange);
      unsubs.push(() => yStore.off('change', handleChange));

      /* -------------------- Awareness ------------------- */

      const userPreferences = computed<Awareness>('userPreferences', () => {
        const user = getUserPreferences();
        return {
          id: user.id,
          color: user.color ?? defaultUserPreferences.color,
          name: user.name ?? defaultUserPreferences.name,
        };
      });

      // Create the instance presence derivation
      const yClientId = room.awareness.clientID.toString();
      const presenceId = InstancePresenceRecordType.createId(yClientId);
      const presenceDerivation = createPresenceStateDerivation(userPreferences)(store);

      // Set our initial presence from the derivation's current value
      room.awareness.setLocalStateField('presence', presenceDerivation.value);

      // When the derivation change, sync presence to to yjs awareness
      unsubs.push(
        react('when presence changes', () => {
          const presence = presenceDerivation.value;
          requestAnimationFrame(() => {
            room.awareness.setLocalStateField('presence', presence);
          });
        }),
      );

      // Sync yjs awareness changes to the store
      const handleUpdate = (update: { added: number[]; updated: number[]; removed: number[] }): void => {
        const states = room.awareness.getStates() as Map<number, { presence: TLInstancePresence }>;
        const toRemove: Array<TLInstancePresence['id']> = [];
        const toPut: TLInstancePresence[] = [];

        // Connect records to put / remove
        for (const clientId of update.added) {
          const state = states.get(clientId);
          if (state?.presence !== undefined && state.presence.id !== presenceId) {
            toPut.push(state.presence);
          }
        }

        for (const clientId of update.updated) {
          const state = states.get(clientId);
          if (state?.presence !== undefined && state.presence.id !== presenceId) {
            toPut.push(state.presence);
          }
        }

        for (const clientId of update.removed) {
          toRemove.push(InstancePresenceRecordType.createId(clientId.toString()));
        }

        // Put / remove the records in the store
        store.mergeRemoteChanges(() => {
          if (toRemove.length !== 0) store.remove(toRemove);
          if (toPut.length !== 0) store.put(toPut);
        });
      };

      room.awareness.on('update', handleUpdate);
      unsubs.push(() => {
        room.awareness.off('update', handleUpdate);
      });

      // 2.
      // Initialize the store with the yjs doc records—or, if the yjs doc
      // is empty, initialize the yjs doc with the default store records.
      if (yStore.yarray.length !== 0) {
        // Replace the store records with the yjs doc records
        transact(() => {
          // The records here should be compatible with what's in the store
          store.clear();
          const records = yStore.yarray.toJSON().map(({ val }) => val);
          store.put(records);
        });
      } else {
        // Create the initial store records
        // Sync the store records to the yjs doc
        yDoc.transact(() => {
          for (const record of store.allRecords()) {
            yStore.set(record.id, record);
          }
        });
      }

      setStoreWithStatus({ store, status: 'synced-remote', connectionStatus: 'online' });
    };

    let hasConnectedBefore = false;

    function handleStatusChange({ status }: { status: 'disconnected' | 'connected' }): void {
      // If we're disconnected, set the store status to 'synced-remote' and the connection status to 'offline'
      if (status === 'disconnected') {
        setStoreWithStatus({ store, status: 'synced-remote', connectionStatus: 'offline' });
        return;
      }

      room.off('synced', handleSync);

      if (status === 'connected') {
        if (hasConnectedBefore) return;
        hasConnectedBefore = true;
        room.on('synced', handleSync);
        unsubs.push(() => {
          room.off('synced', handleSync);
        });
      }
    }

    room.on('status', handleStatusChange);
    unsubs.push(() => {
      room.off('status', handleStatusChange);
    });

    return () => {
      unsubs.forEach((fn) => {
        fn();
      });
      unsubs.length = 0;
    };
  }, [room, yDoc, store, yStore]);

  return storeWithStatus;
};
