import { Box, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, useColorModeValue, VStack } from '@chakra-ui/react';
import { Allotment } from 'allotment';
import CodeEditor from '../../components/code/CodeEditor';
import ChatBox from '../../components/chat/ChatBox';
import CollaboratorUsers from './CollaboratorUsers';
import RoomInfo from './RoomInfo';
import UserTab from './UserTab';
import React, { useRef } from 'react';
import { SocketProvider } from '../../context/socket';
import CollaborationQuestion from './CollaborationQuestion';
import { type editor } from 'monaco-editor';
import CodeExecutor from '../../components/code/CodeExecutor';
import IconWithText from '../../components/content/IconWithText';
import { HiMiniCodeBracketSquare, HiMiniChatBubbleLeftRight } from 'react-icons/hi2';

const CollaborationRoom: React.FC = () => {
  const editorTheme = useColorModeValue('light', 'vs-dark');
  const codeEditor = useRef<editor.IStandaloneCodeEditor | null>(null);

  return (
    <SocketProvider>
      <Flex mt={4} mx={4} justifyContent="space-between">
        <RoomInfo />
        <CollaboratorUsers />
      </Flex>
      <Box width="100%" height="80vh" my={5}>
        <Allotment defaultSizes={[6, 10, 5]}>
          <Allotment.Pane>
            <CollaborationQuestion />
          </Allotment.Pane>
          <Allotment.Pane>
            <Box as="div" style={{ maxHeight: '80vh' }}>
              <CodeEditor
                enableRealTimeEditing
                defaultTheme={editorTheme}
                defaultDownloadedFileName="PeerPrep"
                editorHeight="70vh"
                ref={codeEditor}
              />
            </Box>
          </Allotment.Pane>
          <Allotment.Pane>
            <VStack as="div" style={{ height: '95%', width: '100%' }} paddingX={4}>
              <Tabs isFitted width="100%" height="95%" variant="soft-rounded">
                <TabList>
                  <Tab>
                    <IconWithText text="Chat" icon={<HiMiniChatBubbleLeftRight />} />
                  </Tab>
                  <Tab>
                    <IconWithText text="Run Code" icon={<HiMiniCodeBracketSquare />} />
                  </Tab>
                </TabList>
                <TabPanels height="100%">
                  <TabPanel px={0} height="100%">
                    <VStack as="div" height="100%">
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
                  </TabPanel>
                  <TabPanel px={0} height="100%">
                    <VStack as="div" height="100%">
                      <CodeExecutor defaultTheme={editorTheme} ref={codeEditor} />
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </VStack>
          </Allotment.Pane>
        </Allotment>
      </Box>
    </SocketProvider>
  );
};

export default CollaborationRoom;
