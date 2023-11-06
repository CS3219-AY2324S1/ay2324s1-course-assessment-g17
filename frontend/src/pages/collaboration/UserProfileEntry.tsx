import { Avatar, HStack, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useAppSelector } from '../../reducers/hooks';
import { selectUser } from '../../reducers/authSlice';
import { type AwarenessUser } from '../../types/code/awareness';

interface UserProfileEntryProps {
  userAwareness: AwarenessUser;
}

const UserProfileEntry: React.FC<UserProfileEntryProps> = ({ userAwareness }: UserProfileEntryProps) => {
  const currentUser = useAppSelector(selectUser);
  return (
    <HStack
      spacing={4}
      paddingX={4}
      paddingY={2}
      borderRadius={4}
      _hover={{ backgroundColor: useColorModeValue('gray.50', 'gray.700') }}
    >
      <Avatar size="md" name={userAwareness.user.name} backgroundColor={userAwareness.user.color} color="black" />
      <Stack spacing={0}>
        <Text fontSize="md" fontWeight="bold">
          {userAwareness.user.name} {currentUser?.id === userAwareness.user.userId ? '(Me)' : ''}
        </Text>
        <Text fontSize="xs">{userAwareness.user.email}</Text>
      </Stack>
    </HStack>
  );
};

export default UserProfileEntry;
