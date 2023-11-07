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
import ToastWrapper from '../../utils/toast';

interface CollaborationRoomProps {
  isMatchingRoom: boolean;
}
const CollaborationRoom: React.FC<CollaborationRoomProps> = ({ isMatchingRoom }: CollaborationRoomProps) => {
  const toast = new ToastWrapper();
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

  const handleQuestionChange = (newQuestionId: number | undefined): void => {
    setQuestionId(newQuestionId);
    // Emit change-question event to let other connected users know to change the question
    socket?.emit('change-question', newQuestionId, roomId, user?.username);
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
      toast.showWarningToast({ title: 'You have to attempt at least one question before ending the session' });
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

    try {
      const isAuthorised = await collaborationServiceApi.checkAuthorisation(user.id, roomId);
      if (!isAuthorised) {
        toast.showWarningToast({ title: 'Invalid permission', description: 'Room does not belong to you.' });
        navigate('/');
      }
    } catch (error) {
      console.error('Error checking authorization:', error);
    }
  };

  // Attach socket listeners relevant only for matching room
  const attachMatchingListeners = (): void => {
    // Listen to set first question
    socket?.on('set-first-question', (questionId: number) => {
      setQuestionId(questionId);
      socket?.off('set-first-question');
    });

    // Attach listener for when other user tries to go to next question
    socket?.on('waiting-for-other-user', () => {
      toast.showSuccessToast({ title: 'Both users have to agree to go to the next question' });
    });

    // Attach listener for when other user tries to end the session
    socket?.on('waiting-for-other-user-end', () => {
      toast.showSuccessToast({ title: 'Both users have to agree to end the session' });
    });

    // Attach listener for when both users have agreed to proceed to the next question
    socket?.on('both-users-agreed-next', async (roomId: string) => {
      console.log('Both users agreed to go to the next question');

      // Save the first question as attempted
      setAttemptedFirst(true);
      await addSavedQuestion(1, roomId);

      // Remove listener (only 2 questions per session)
      socket?.off('both-users-agreed-next');

      // Go to the next question, no need to emit change-question
      // event as users are responsible for retrieving and updating their own question
      const nextQuestionData = await collaborationServiceApi.getMatchedSecondQuestion(roomId);
      const nextQuestionId = Number(nextQuestionData.questionID);
      setQuestionId(nextQuestionId);
    });

    // Attach listener for when both users have agreed to end the session
    socket?.on('both-users-agreed-end', async (roomId: string) => {
      // Save the question before leaving the room
      await addSavedQuestion(2, roomId);
      socket?.off('both-users-agreed-end');
      navigate('/');
    });
  };

  // Attach socket listeners relevant only for practice room
  const attachPracticeRoomListeners = (): void => {
    // Listen to set question events and show toast
    socket?.on('set-question', (questionId: number, username: string) => {
      setQuestionId(questionId);
      toast.showInfoToast({ title: `User ${username} changed the question` });
    });
  };

  useEffect(() => {
    if (isMatchingRoom) {
      // Check that the user is authorised to enter the room
      void checkAuthorization();
    }
  }, []);

  useEffect(() => {
    // Emit join-room event to broadcast new user entering room
    socket?.emit('join-room', roomId, user?.username);

    // Attach matching listeners only for matching room
    if (isMatchingRoom) {
      attachMatchingListeners();
    } else {
      attachPracticeRoomListeners();
    }

    return () => {
      if (isMatchingRoom) {
        socket?.off('both-users-agreed-next');
        socket?.off('both-users-agreed-end');
      }
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
