import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { Allotment } from 'allotment';
import CodeEditor from '../../components/code/CodeEditor';
import ChatBox from '../../components/chat/ChatBox';
import CollaboratorUsers from './CollaboratorUsers';
import RoomInfo from './RoomInfo';
import UserTab from './UserTab';
import React, { useState } from 'react';
import { SocketProvider } from '../../context/socket';
import CollaborationQuestion from './CollaborationQuestion';

const CollaborationRoom: React.FC = () => {
  const editorTheme = useColorModeValue('light', 'vs-dark');

  return (
    <SocketProvider>
      <Flex mt={4} mx={4} justifyContent="space-between">
        <RoomInfo />
        <CollaboratorUsers />
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
          <Allotment.Pane>
            <VStack as="div" style={{ height: '100%', width: '100%', paddingLeft: '16px', paddingRight: '16px' }}>
              <Box
                width="100%"
                alignSelf="flex-start"
                _light={{ backgroundColor: 'gray.200' }}
                _dark={{ backgroundColor: 'gray.700' }}
                borderRadius={8}
              >
                <UserTab />
              </Box>
              <ChatBox />
            </VStack>
          </Allotment.Pane>
        </Allotment>
      </Box>
    </SocketProvider>
  );
};

export default CollaborationRoom;
