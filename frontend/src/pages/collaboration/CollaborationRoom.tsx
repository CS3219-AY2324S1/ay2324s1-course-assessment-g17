import {
  Box,
  Flex,
  HStack,
  VStack,
  useColorModeValue,
  Text,
  NumberInput,
  NumberInputField,
  Button,
} from '@chakra-ui/react';
import { Allotment } from 'allotment';
import CodeEditor from '../../components/code/CodeEditor';
import ChatBox from '../../components/chat/ChatBox';
import CollaboratorUsers from './CollaboratorUsers';
import RoomInfo from './RoomInfo';
import UserTab from './UserTab';
import React, { useState } from 'react';
import QuestionDetails from '../questions/QuestionDetails';

const CollaborationRoom: React.FC = () => {
  const editorTheme = useColorModeValue('light', 'vs-dark');
  const [showUserTab, toggleShowUserTab] = useState(false);
  const [questionIdInput, setQuestionIdInput] = useState<number | undefined>(undefined);
  const [questionId, setQuestionId] = useState<number | undefined>(undefined);

  return (
    <>
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
            <VStack as="div" style={{ overflowY: 'auto', height: '100%', paddingLeft: '16px', paddingRight: '16px' }}>
              <Box
                width="100%"
                padding={4}
                alignSelf="flex-start"
                _light={{ backgroundColor: 'gray.200' }}
                _dark={{ backgroundColor: 'gray.700' }}
                borderRadius={8}
              >
                <HStack spacing={4}>
                  <Text>Selected Question ID</Text>
                  <NumberInput
                    size="sm"
                    maxWidth="80px"
                    onChange={(e) => {
                      setQuestionIdInput(parseInt(e, 10));
                    }}
                  >
                    <NumberInputField />
                  </NumberInput>
                  <Button
                    size="sm"
                    onClick={() => {
                      setQuestionId(questionIdInput);
                    }}
                  >
                    Update
                  </Button>
                </HStack>
              </Box>
              {questionId === undefined && (
                <Text mt={16} size="xl">
                  No question selected yet
                </Text>
              )}
              {questionId !== undefined && <QuestionDetails questionId={questionId} />}
            </VStack>
          </Allotment.Pane>
          <Allotment.Pane>
            <Box as="div" style={{ maxHeight: '85vh' }}>
              <CodeEditor enableRealTimeEditing defaultTheme={editorTheme} defaultDownloadedFileName="PeerPrep" />
            </Box>
          </Allotment.Pane>
          <Allotment.Pane visible={showUserTab}>
            <VStack as="div" style={{ height: '100%' }}>
              <Box
                width="100%"
                padding={4}
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
    </>
  );
};

export default CollaborationRoom;
