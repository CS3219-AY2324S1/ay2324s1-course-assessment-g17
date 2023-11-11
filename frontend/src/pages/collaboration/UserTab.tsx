import { Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useAppSelector } from '../../reducers/hooks';
import { selectAwareness } from '../../reducers/awarenessSlice';
import UserProfileEntry from './UserProfileEntry';

const UserTab: React.FC = () => {
  const awareness = useAppSelector(selectAwareness);
  return (
    <Accordion allowMultiple>
      <AccordionItem>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            <Text fontWeight="bold">
              {awareness?.length} {awareness?.length === 1 ? 'user' : 'users'} in session
            </Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          {awareness?.map((awareness, index) => <UserProfileEntry key={index} userAwareness={awareness} />)}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default UserTab;
