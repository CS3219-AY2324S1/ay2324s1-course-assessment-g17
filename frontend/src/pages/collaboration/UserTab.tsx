import { Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useAppSelector } from '../../reducers/hooks';
import { selectAwareness } from '../../reducers/awarenessSlice';
import UserProfileEntry from './UserProfileEntry';

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
          {/* Not implemented yet */}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default UserTab;
