import { Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useAppSelector } from '../../reducers/hooks';
import { selectAwareness } from '../../reducers/awarenessSlice';
import UserProfileEntry from './UserProfileEntry';
import Chat from '../../components/chat/Chat';

const UserTab: React.FC = () => {
  const awareness = useAppSelector(selectAwareness);
  return (
    <Accordion defaultIndex={[0]} allowMultiple>
      <AccordionItem>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            <Text fontWeight="bold">
              {awareness?.length} {awareness?.length === 1 ? 'user' : 'users'} in session
            </Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}>
          {awareness?.map((awareness, index) => <UserProfileEntry key={index} userAwareness={awareness} />)}
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            <Text fontWeight="bold">Chat</Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Chat />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default UserTab;
