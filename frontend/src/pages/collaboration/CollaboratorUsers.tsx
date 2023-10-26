import { Avatar, AvatarGroup, Box, Button, HStack, Tooltip, useToast } from '@chakra-ui/react';
import { selectAwareness } from '../../reducers/awarenessSlice';
import { useAppSelector } from '../../reducers/hooks';
import { selectUser } from '../../reducers/authSlice';
import { HiUserGroup } from 'react-icons/hi';
import React, { useContext, useEffect } from 'react';
import { SocketContext } from '../../context/socket';

const CollaboratorUsers: React.FC = () => {
  const toast = useToast();
  const awareness = useAppSelector(selectAwareness);
  const currentUser = useAppSelector(selectUser);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    // Add listener for new users
    socket?.on('user-join', (newUser: string) => {
      toast({
        title: `User ${newUser} has joined the room`,
        status: 'info',
        duration: 4000,
        isClosable: true,
      });
    });

    // Add listener for disconnected user
    socket?.on('user-disconnect', (disconnectedUser: string) => {
      toast({
        title: `User ${disconnectedUser} has left the room`,
        status: 'info',
        duration: 4000,
        isClosable: true,
      });
    });
  }, [socket]);

  return (
    <HStack spacing={3}>
      <AvatarGroup size="sm" max={10} spacing={1}>
        {awareness?.map((state, index) => (
          <Box key={index}>
            <Tooltip
              hasArrow
              label={`@${state.awareness.name}${currentUser?.id === state.awareness.userId ? ' (Me)' : ''}`}
            >
              <Avatar size="sm" name={state.awareness.name} backgroundColor={state.awareness.color} color="black" />
            </Tooltip>
          </Box>
        ))}
      </AvatarGroup>
      <Button variant="outline" size="sm" leftIcon={<HiUserGroup size={20} />}>
        {awareness?.length}
      </Button>
    </HStack>
  );
};

export default CollaboratorUsers;
