import { Avatar, HStack, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { type AwarenessState } from '../../reducers/awarenessSlice';
import React from 'react';
import { useAppSelector } from '../../reducers/hooks';
import { selectUser } from '../../reducers/authSlice';

interface UserProfileEntryProps {
  userAwareness: AwarenessState;
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
      <Avatar
        size="md"
        name={userAwareness.awareness.name}
        backgroundColor={userAwareness.awareness.color}
        color="black"
      />
      <Stack spacing={0}>
        <Text fontSize="md" fontWeight="bold">
          {userAwareness.awareness.name} {currentUser?.id === userAwareness.awareness.userId ? '(Me)' : ''}
        </Text>
        <Text fontSize="xs">{userAwareness.awareness.email}</Text>
      </Stack>
    </HStack>
  );
};

export default UserProfileEntry;
