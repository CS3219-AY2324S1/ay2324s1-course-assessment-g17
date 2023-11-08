import { Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Box, Text } from '@chakra-ui/react';
import React from 'react';
import UserProfileEntry from './UserProfileEntry';
import { useUsers } from 'y-presence';
import { type AwarenessUser, type AwarenessUsers } from '../../types/code/awareness';

interface UserTabProps {
  awareness: AwarenessUser;
}

const UserTab: React.FC<UserTabProps> = ({ awareness }) => {
  const users = useUsers(awareness) as AwarenessUsers;

  return (
    <Accordion allowMultiple>
      <AccordionItem>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            <Text fontWeight="bold">
              {users.size} {users.size === 1 ? 'user' : 'users'} in session
            </Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          {Array.from(users.values())?.map((awareness, index) => (
            <UserProfileEntry key={index} userAwareness={awareness} />
          ))}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default UserTab;
