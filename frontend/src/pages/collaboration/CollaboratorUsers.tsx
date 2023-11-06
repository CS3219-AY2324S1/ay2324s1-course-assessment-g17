import { Avatar, AvatarGroup, Box, Button, HStack, Tooltip, useToast } from '@chakra-ui/react';
import { useAppSelector } from '../../reducers/hooks';
import { selectUser } from '../../reducers/authSlice';
import { HiUserGroup } from 'react-icons/hi';
import React, { useContext, useEffect } from 'react';
import { SocketContext } from '../../context/socket';
import { useUsers } from 'y-presence';
import { type AwarenessUsers, type AwarenessUser } from '../../types/code/awareness';

interface UserTabProps {
  awareness: AwarenessUser;
}

const CollaboratorUsers: React.FC<UserTabProps> = ({ awareness }: UserTabProps) => {
  const toast = useToast();
  const users = useUsers(awareness) as AwarenessUsers;
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
        {Array.from(users.values())?.map((user, index) => (
          <Box key={index}>
            <Tooltip hasArrow label={`@${user.user.name}${currentUser?.id === user.user.userId ? ' (Me)' : ''}`}>
              <Avatar size="sm" name={user.user.name} backgroundColor={user.user.color} color="black" />
            </Tooltip>
          </Box>
        ))}
      </AvatarGroup>
      <Button variant="outline" size="sm" leftIcon={<HiUserGroup size={20} />}>
        {users.size}
      </Button>
    </HStack>
  );
};

export default CollaboratorUsers;
