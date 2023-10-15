import { Tabs, TabList, TabPanels, Tab, TabPanel, Text } from '@chakra-ui/react';
import React from 'react';
import { useAppSelector } from '../../reducers/hooks';
import { selectAwareness } from '../../reducers/awarenessSlice';
import UserProfileEntry from './UserProfileEntry';
import Chat from '../../components/chat/Chat';

const UserTab: React.FC = () => {
  const awareness = useAppSelector(selectAwareness);
  return (
    <>
      <Tabs style={{ overflowY: 'auto', height: '100%' }}>
        <TabList>
          <Tab>
            <Text fontWeight="bold">
              {awareness?.length} {awareness?.length === 1 ? 'user' : 'users'}
            </Text>
          </Tab>
          <Tab>
            <Text fontWeight="bold">Chat</Text>
          </Tab>
        </TabList>
        <TabPanels style={{ overflowY: 'auto', height: '100%' }}>
          <TabPanel style={{ overflowY: 'auto', height: '100%' }} pb={4}>
            {awareness?.map((awareness, index) => <UserProfileEntry key={index} userAwareness={awareness} />)}
          </TabPanel>
          <TabPanel style={{ overflowY: 'auto', height: '100%' }} pb={4}>
            <Chat />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default UserTab;
