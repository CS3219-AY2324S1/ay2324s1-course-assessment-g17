import { Avatar, AvatarGroup, Box, Tooltip } from '@chakra-ui/react';
import { useUsers } from 'y-presence';
import { type WebsocketProvider } from 'y-websocket';
import React from 'react';
import { type WhiteboardRoomState } from './useYjsStore';

interface WhiteboardAwarenessDisplayProps {
  awareness: WebsocketProvider['awareness'];
}

const WhiteboardAwarenessDisplay: React.FC<WhiteboardAwarenessDisplayProps> = ({
  awareness,
}: WhiteboardAwarenessDisplayProps) => {
  const users = useUsers(awareness) as WhiteboardRoomState;
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
        justifyContent="left"
        marginTop={16}
        marginLeft={2}
      >
        <AvatarGroup size="sm" max={10} spacing={2} pointerEvents="all">
          {Array.from(users.values()).map(
            (user, index) =>
              // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              user.presence && (
                <Box key={index}>
                  <Tooltip hasArrow label={`@${user.presence?.userName}`}>
                    <Avatar
                      size="sm"
                      name={user.presence?.userName}
                      backgroundColor={user.presence?.color}
                      color="black"
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
