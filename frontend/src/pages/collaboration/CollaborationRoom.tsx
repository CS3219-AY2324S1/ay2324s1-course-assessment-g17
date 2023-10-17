import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { Allotment } from 'allotment';
import CodeEditor from '../../components/code/CodeEditor';
import CollaboratorUsers from './CollaboratorUsers';
import RoomInfo from './RoomInfo';
import UserTab from './UserTab';
import React, { useState } from 'react';
import { SocketProvider } from '../../context/socket';
import CollaborationQuestion from './CollaborationQuestion';

const CollaborationRoom: React.FC = () => {
  const editorTheme = useColorModeValue('light', 'vs-dark');
  const [showUserTab, toggleShowUserTab] = useState(false);

  return (
    <SocketProvider>
      <Flex mt={4} mx={4} justifyContent="space-between">
        <RoomInfo />
        <CollaboratorUsers
          onUserTabToggle={() => {
            toggleShowUserTab(!showUserTab);
          }}
        />
      </Flex>
      <Box width="100%" height="80vh" my={5}>
        <Allotment defaultSizes={[6, 10, 4]}>
          <Allotment.Pane>
            <CollaborationQuestion />
          </Allotment.Pane>
          <Allotment.Pane>
            <Box as="div" style={{ maxHeight: '85vh' }}>
              <CodeEditor enableRealTimeEditing defaultTheme={editorTheme} defaultDownloadedFileName="PeerPrep" />
            </Box>
          </Allotment.Pane>
          <Allotment.Pane visible={showUserTab}>
            <Box as="div" style={{ overflowY: 'auto', height: '100%' }}>
              <UserTab />
            </Box>
          </Allotment.Pane>
        </Allotment>
      </Box>
    </SocketProvider>
  );
};

export default CollaborationRoom;
