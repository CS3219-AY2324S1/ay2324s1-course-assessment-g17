import React from 'react';
import { Box, Flex, VStack, useColorModeValue } from '@chakra-ui/react';
import { Allotment } from 'allotment';
import CodeEditor from '../../components/code/CodeEditor';
import CollaboratorUsers from './CollaboratorUsers';
import RoomInfo from './RoomInfo';

const CollaborationRoom: React.FC = () => {
  const editorTheme = useColorModeValue('light', 'vs-dark');

  return (
    <>
      <Flex mt={4} mx={4} justifyContent="space-between">
        <RoomInfo />
        <CollaboratorUsers />
      </Flex>
      <Box width="100%" height="85vh" my={5}>
        <Allotment>
          <Allotment.Pane>
            <VStack as="div" style={{ overflowY: 'auto', height: '100%', padding: '16px' }}>
              <h1>left pane</h1>
            </VStack>
          </Allotment.Pane>
          <Allotment.Pane>
            <Box as="div" style={{ maxHeight: '85vh' }}>
              <CodeEditor enableRealTimeEditing defaultTheme={editorTheme} defaultDownloadedFileName="PeerPrep" />
            </Box>
          </Allotment.Pane>
        </Allotment>
      </Box>
    </>
  );
};

export default CollaborationRoom;
