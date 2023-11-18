import { type WebsocketProvider } from 'y-websocket';

export interface AwarenessUserAttribute {
  userId: number;
  name: string;
  email: string;
  color: string;
}

export type AwarenessUser = WebsocketProvider['awareness'] & { user: AwarenessUserAttribute };

export type AwarenessUsers = Map<number, AwarenessUser>;
