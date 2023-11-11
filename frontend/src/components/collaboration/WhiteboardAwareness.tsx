// eslint-disable @typescript-eslint/no-unsafe-assignment

import { Avatar, AvatarGroup, Box, Tooltip } from '@chakra-ui/react';
import { useSelf, useUsers } from 'y-presence';
import { type WebsocketProvider } from 'y-websocket';
import React from 'react';
import { type WhiteboardRoomState } from './useYjsStore';
import { type TLInstancePresence, useEditor } from '@tldraw/tldraw';

interface WhiteboardAwarenessDisplayProps {
  awareness: WebsocketProvider['awareness'];
}

const WhiteboardAwarenessDisplay: React.FC<WhiteboardAwarenessDisplayProps> = ({
  awareness,
}: WhiteboardAwarenessDisplayProps) => {
  const self = useSelf(awareness) as { presence: TLInstancePresence };
  const users = useUsers(awareness) as WhiteboardRoomState;
  const whiteboard = useEditor();

  return (
    <Box position="absolute" inset="0px" zIndex="300" pointerEvents="none">
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        zIndex="300"
        display="flex"
        alignItems="top"
        justifyContent="center"
        marginTop={2}
      >
        <AvatarGroup size="sm" max={5} spacing={2} pointerEvents="all">
          {Array.from(users.values()).map(
            (user, index) =>
              // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              user.presence && (
                <Box key={index}>
                  <Tooltip
                    hasArrow
                    label={`@${user.presence?.userName}${self.presence.userId === user.presence.userId ? ' (Me)' : ''}`}
                  >
                    <Avatar
                      size="sm"
                      name={user.presence?.userName}
                      backgroundColor={user.presence?.color}
                      color="white"
                      onClick={() => {
                        self.presence.userId !== user.presence.userId &&
                          whiteboard.startFollowingUser(user.presence.userId);
                      }}
                    />
                  </Tooltip>
                </Box>
              ),
          )}
        </AvatarGroup>
      </Box>
    </Box>
  );
};

export default WhiteboardAwarenessDisplay;
