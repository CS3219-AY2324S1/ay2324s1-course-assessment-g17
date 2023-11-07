import {
  Box,
  Button,
  Flex,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { Allotment } from 'allotment';
import CodeEditor from '../../components/code/CodeEditor';
import CollaboratorUsers from './CollaboratorUsers';
import RoomInfo from './RoomInfo';
import UserTab from './UserTab';
import React, { useContext, useEffect, useRef, useState } from 'react';
import CollaborationQuestion from './CollaborationQuestion';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../reducers/hooks';
import { selectUser } from '../../reducers/authSlice';
import { SocketContext } from '../../context/socket';
import { HiMiniCodeBracketSquare, HiMiniChatBubbleLeftRight } from 'react-icons/hi2';
import { type editor } from 'monaco-editor';
import CodeExecutor from '../../components/code/CodeExecutor';
import ChatBox from '../../components/chat/ChatBox';
import IconWithText from '../../components/content/IconWithText';
import Whiteboard from '../../components/collaboration/Whiteboard';
import { selectAwareness } from '../../reducers/awarenessSlice';
import Hint from './Hint';
import UserAPI from '../../api/users/user';
import CollaborationAPI from '../../api/collaboration/collaboration';

interface CollaborationRoomProps {
  isMatchingRoom: boolean;
}
const CollaborationRoom: React.FC<CollaborationRoomProps> = ({ isMatchingRoom }: CollaborationRoomProps) => {
  const toast = useToast();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const awareness = useAppSelector(selectAwareness);
  const roomId = useParams<{ roomId: string }>().roomId;
  const editorTheme = useColorModeValue('light', 'vs-dark');
  const codeEditor = useRef<editor.IStandaloneCodeEditor | null>(null);
  const { socket } = useContext(SocketContext);

  const collaborationServiceApi = new CollaborationAPI();
  const userServiceApi = new UserAPI();
  const [attemptedFirst, setAttemptedFirst] = useState(false);
  const [questionId, setQuestionId] = useState<number | undefined>(undefined);

  const handleQuestionChange = (newQuestionId: number | undefined): void => {
    setQuestionId(newQuestionId);
  };

  const addSavedQuestion = async (currIndex: 1 | 2, roomId: string): Promise<void> => {
    // Save both users
    const currQuestion = await collaborationServiceApi.getMatchedQuestion(currIndex, roomId);
    const pairIds = await collaborationServiceApi.getMatchedPairInfo(roomId);
    const userOneId = pairIds.userOne;
    const userTwoId = pairIds.userTwo;

    try {
      if (user?.id === userOneId) {
        await userServiceApi.postSaveAnsweredQuestion(userOneId, currQuestion);
      } else if (user?.id === userTwoId) {
        await userServiceApi.postSaveAnsweredQuestion(userTwoId, currQuestion);
      }
    } catch (error) {
      console.error('Error adding saved question:', error);
    }
  };

  // A user clicks next
  const handleNextQuestion = (): void => {
    if (user === null) return;
    socket?.emit('user-agreed-next', roomId, user.id);
    setAttemptedFirst(true);
  };

  // A user clicks end session
  const handleEndSession = (): void => {
    if (user === null) return;
    if (!attemptedFirst) {
      toast({
        title: 'You have to attempt at least one question before ending the session',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    socket?.emit('user-agreed-end', roomId, user.id);
  };

  const checkAuthorization = async (): Promise<void> => {
    if (user === null || roomId == null) {
      console.error('User/ Room ID is undefined');
      navigate('/');
      return;
    }

    const isAuthorised = await collaborationServiceApi.checkAuthorisation(user.id, roomId);
    if (!isAuthorised) {
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

  useEffect(() => {
    socket?.emit('join-room', roomId, user?.username);

    socket?.on('waiting-for-other-user', () => {
      toast({
        title: 'Both users have to agree to go to the next question',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    });

    socket?.on('waiting-for-other-user-end', () => {
      toast({
        title: 'Both users have to agree to end the session',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    });

    socket?.on('both-users-agreed-next', async (roomId: string) => {
      console.log('Both users agreed to go to the next question');
      setAttemptedFirst(true);
      await addSavedQuestion(1, roomId);
      socket?.off('both-users-agreed-next');

      const nextQuestionData = await collaborationServiceApi.getMatchedSecondQuestion(roomId);
      const nextQuestionId = Number(nextQuestionData.questionID);
      setQuestionId(nextQuestionId);
      socket?.emit('change-question', nextQuestionId, roomId);
    });

    socket?.on('both-users-agreed-end', async (roomId: string) => {
      await addSavedQuestion(2, roomId);
      socket?.off('both-users-agreed-end');
      navigate('/');
    });

    socket?.on('set-question', (questionId: number) => {
      setQuestionId(questionId);
    });

    socket?.on('broadcast-question', (questionId: number) => {
      setQuestionId(questionId);
    });

    return () => {
      socket?.off('both-users-agreed-next');
      socket?.off('both-users-agreed-end');
    };
  }, [socket, roomId]);

  return (
    <>
      <Flex mt={4} mx={4} justifyContent="space-between">
        <RoomInfo />
        {isMatchingRoom && (
          <>
            {!attemptedFirst && (
              <Button size="sm" onClick={handleNextQuestion} mx={4}>
                Next Question {attemptedFirst}
              </Button>
            )}
            <Button size="sm" mx={4} onClick={handleEndSession}>
              End Session
            </Button>
          </>
        )}
        {!isMatchingRoom && (
          <>
            <Button
              size="sm"
              mx={4}
              onClick={() => {
                navigate('/');
              }}
            >
              Exit
            </Button>
          </>
        )}
        <Spacer />
        {awareness !== null && <CollaboratorUsers awareness={awareness} />}
        {questionId !== undefined && <Hint questionId={questionId} />}
        <Whiteboard />
      </Flex>
      <Box width="100%" height="80vh" my={5}>
        <Allotment defaultSizes={[6, 9, 5]}>
          <Allotment.Pane>
            <CollaborationQuestion
              questionId={questionId}
              disableSelection={isMatchingRoom}
              onQuestionIdChange={handleQuestionChange}
            />
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
                    <IconWithText text="Code Run" icon={<HiMiniCodeBracketSquare />} />
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
                        {awareness !== null && <UserTab awareness={awareness} />}
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
    </>
  );
};

export default CollaborationRoom;
