import { Avatar, AvatarGroup, Box, Button, HStack, Tooltip } from '@chakra-ui/react';
import { selectAwareness } from '../../reducers/awarenessSlice';
import { useAppSelector } from '../../reducers/hooks';
import { selectUser } from '../../reducers/authSlice';
import { HiUserGroup } from 'react-icons/hi';
import React from 'react';

const CollaboratorUsers: React.FC = () => {
  const awareness = useAppSelector(selectAwareness);
  const currentUser = useAppSelector(selectUser);

  return (
    <HStack spacing={3}>
      <AvatarGroup size="sm" max={10} spacing={1}>
        {awareness?.map((state, index) => (
          <Box key={index}>
            <Tooltip
              hasArrow
              label={`@${state.awareness.name}${currentUser?.id === state.awareness.userId ? ' (You)' : ''}`}
            >
              <Avatar
                showBorder
                size="sm"
                name={state.awareness.name}
                backgroundColor={state.awareness.color}
                color="black"
              />
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
