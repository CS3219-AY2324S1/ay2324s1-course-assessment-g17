import { Box, Flex, useColorModeValue, Button, useToast, Spacer } from '@chakra-ui/react';
import { Allotment } from 'allotment';
import CodeEditor from '../../components/code/CodeEditor';
import CollaboratorUsers from './CollaboratorUsers';
import RoomInfo from './RoomInfo';
import UserTab from './UserTab';
import React, { useContext, useEffect, useState } from 'react';
import CollaborationQuestion from './CollaborationQuestion';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../reducers/hooks';
import { selectUser } from '../../reducers/authSlice';
import { SocketContext } from '../../context/socket';
import axios from 'axios';
interface Question {
  questionID: string;
  complexity: string;
  categories: string[];
}

interface PairIdsResponse {
  _id: string;
  userOne: number;
  userTwo: number;
  room_id: string;
  complexity: string[];
  categories: string[];
  question_ids: number[];
  __v: number;
}

interface CollaborationRoomProps {
  isMatchingRoom: boolean;
}
const CollaborationRoom: React.FC<CollaborationRoomProps> = ({ isMatchingRoom }: CollaborationRoomProps) => {
  const collabServiceUrl = process.env.REACT_APP_COLLABORATION_SERVICE_SOCKET_IO_BACKEND_URL;
  const userServiceUrl = process.env.REACT_APP_USER_SERVICE_BACKEND_URL;
  const [attemptedFirst, setAttemptedFirst] = useState(false);
  const toast = useToast();
  const editorTheme = useColorModeValue('light', 'vs-dark');
  const user = useAppSelector(selectUser);
  const { socket } = useContext(SocketContext);
  const roomId = useParams<{ roomId: string }>().roomId;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [questionId, setQuestionId] = useState<number | undefined>(undefined);

  const navigate = useNavigate();
  const addSavedQuestion = async (currIndex: number, roomId: number): Promise<void> => {
    const currQuestionResponse = await axios.get(
      collabServiceUrl + (currIndex === 1 ? 'api/get-first-question' : 'api/get-second-question'),
      {
        params: {
          roomId,
        },
      },
    );

    const pairIdsResponse = await axios.get(collabServiceUrl + 'api/get-pair-ids', {
      params: {
        roomId,
      },
    });
    // save both users
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const pairIds = pairIdsResponse.data as PairIdsResponse;
    const userOneId = pairIds.userOne;
    const userTwoId = pairIds.userTwo;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const currQuestion = currQuestionResponse.data.data as Question;
    await axios.post(userServiceUrl + 'api/user/add-answered-question', {
      userId: userOneId,
      questionId: currQuestion.questionID,
      complexity: currQuestion.complexity,
      category: currQuestion.categories,
    });
    await axios.post(userServiceUrl + 'api/user/add-answered-question', {
      userId: userTwoId,
      questionId: currQuestion.questionID,
      complexity: currQuestion.complexity,
      category: currQuestion.categories,
    });
  };

  // a user click next
  const handleNextQuestion = (): void => {
    if (user === null) {
      return;
    }
    socket?.emit('user-agreed-next', roomId, user.id);
    toast({
      title: 'Both users have to agree to go to the next question',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    setAttemptedFirst(true);
  };

  // a user click end session
  const handleEndSession = (): void => {
    if (user === null) {
      return;
    }
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
    toast({
      title: 'Both users have to agree to end the session',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  useEffect(() => {
    const checkAuthorization = async (): Promise<void> => {
      if (user === null) {
        console.error('User ID is undefined');
        navigate('/');
        return;
      }
      const response = await axios.get<{ authorised: boolean }>(collabServiceUrl + 'api/check-authorization', {
        params: {
          userId: user.id,
          roomId,
        },
      });
      console.log('Response:', response.data);

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
    checkAuthorization().catch((error) => {
      console.error('Error checking authorization:', error);
    });
  }, []);

  useEffect(() => {
    socket?.emit('join-room', roomId, user?.username);

    socket?.on('both-users-agreed-next', async (roomId: number) => {
      setAttemptedFirst(true);
      const nextQuestionResponse = await axios.get(collabServiceUrl + 'api/get-second-question', {
        params: {
          roomId,
        },
      });
      addSavedQuestion(1, roomId).catch((error) => {
        console.error('Error adding saved question:', error);
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const nextQuestionData = nextQuestionResponse.data.data as Question;

      const nextQuestionId = Number(nextQuestionData.questionID);
      setQuestionId(nextQuestionId);
      socket?.emit('change-question', nextQuestionId);
    });

    socket?.on('both-users-agreed-end', (roomId: number) => {
      addSavedQuestion(2, roomId).catch((error) => {
        console.error('Error adding saved question:', error);
      });
      navigate('/');
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
            <Button size="sm" onClick={handleNextQuestion} mx={4}>
              Next Question
            </Button>
            <Button size="sm" onClick={handleEndSession}>
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
