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
  useToast,
} from '@chakra-ui/react';
import { Allotment } from 'allotment';
import CodeEditor from '../../components/code/CodeEditor';
import CollaboratorUsers from './CollaboratorUsers';
import RoomInfo from './RoomInfo';
import UserTab from './UserTab';
import React, { useEffect, useState } from 'react';
import QuestionDetails from '../questions/QuestionDetails';
import { useAppSelector } from '../../reducers/hooks';
import { selectUser } from '../../reducers/authSlice';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CollaborationRoom: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const editorTheme = useColorModeValue('light', 'vs-dark');
  const [showUserTab, toggleShowUserTab] = useState(false);
  const [questionIdInput, setQuestionIdInput] = useState<number | undefined>(undefined);
  const [questionId, setQuestionId] = useState<number | undefined>(undefined);
  const { roomId } = useParams();
  const user = useAppSelector(selectUser);

  const checkAuthorization = async (): Promise<void> => {
    if (user === null) {
      console.error('User ID is undefined');
      navigate('/');
      return;
    }
    const REACT_APP_COLLAB_URL = 'http://localhost:8082';
    const response = await axios.get<{ authorised: boolean }>(REACT_APP_COLLAB_URL + '/api/check-authorization', {
      params: {
        userId: user.id,
        roomId,
      },
    });

    if (!response.data.authorised) {
      toast({
        title: 'Invalid permission',
        description: 'Room does not belong to you.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      navigate('/');
    }
  };
  useEffect(() => {
    checkAuthorization().catch((error) => {
      console.error('Error checking authorization:', error);
    });
  }, []);
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
            <Box as="div" style={{ overflowY: 'auto', height: '100%' }}>
              <UserTab />
            </Box>
          </Allotment.Pane>
        </Allotment>
      </Box>
    </>
  );
};

export default CollaborationRoom;
