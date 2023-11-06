import { useUsers } from 'y-presence';
import { type WebsocketProvider } from 'y-websocket';
import React from 'react';
import { Box, Text } from '@chakra-ui/react';

interface WhiteboardAwarenessDisplayProps {
  awareness: WebsocketProvider['awareness'];
}

const WhiteboardAwarenessDisplay: React.FC<WhiteboardAwarenessDisplayProps> = ({
  awareness,
}: WhiteboardAwarenessDisplayProps) => {
  const users = useUsers(awareness);
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
        <Text>Number of connected users: {users.size}</Text>
      </Box>
    </Box>
  );
};

export default WhiteboardAwarenessDisplay;
