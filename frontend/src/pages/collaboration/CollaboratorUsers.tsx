import { Avatar, AvatarGroup, Box, Button, HStack, Tooltip } from '@chakra-ui/react';
import { useAppSelector } from '../../reducers/hooks';
import { selectUser } from '../../reducers/authSlice';
import { HiUserGroup } from 'react-icons/hi';
import React from 'react';
import { useUsers } from 'y-presence';
import { type AwarenessUsers, type AwarenessUser } from '../../types/code/awareness';

interface UserTabProps {
  awareness: AwarenessUser;
}

const CollaboratorUsers: React.FC<UserTabProps> = ({ awareness }: UserTabProps) => {
  const users = useUsers(awareness) as AwarenessUsers;
  const currentUser = useAppSelector(selectUser);

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
