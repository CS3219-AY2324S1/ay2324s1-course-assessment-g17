import React, { useEffect, useState } from 'react';
import { Card, Center, Stack, Button, Text, useToast } from '@chakra-ui/react';
import { io, type Socket } from 'socket.io-client';
import type { QuestionComplexityEnum } from '../../types/questions/questions';
import { FaBoltLightning, FaExclamation } from 'react-icons/fa6';
import IconWithText from '../../components/content/IconWithText';
import MatchingForm from './MatchingForm';
import CountdownProgressBar from './CountdownProgressBar';
import { useAppSelector } from '../../reducers/hooks';
import { selectUser } from '../../reducers/authSlice';
import { useNavigate } from 'react-router-dom';

enum MatchingStateEnum {
  NO_REQUEST,
  PENDING,
  MATCHED,
}

const Matching: React.FC = () => {
  const navigate = useNavigate();
  const userId = useAppSelector(selectUser)?.id;
  const [socket, setSocket] = useState<Socket | null>(null);
  const toast = useToast();
  const [matchingState, setMatchingState] = useState<MatchingStateEnum>(MatchingStateEnum.NO_REQUEST);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_MATCHING_SERVICE_BACKEND_URL as string, {
      path: process.env.REACT_APP_MATCHING_SERVICE_PATH ?? '/socket.io/',
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    newSocket.on('timeout', () => {
      setMatchingState(MatchingStateEnum.NO_REQUEST);

      toast({
        title: 'Matching failed.',
        description: 'Your match request timed out.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    });

    newSocket.on('matchFound', ({ roomId }) => {
      setMatchingState(MatchingStateEnum.MATCHED);
      toast({
        title: 'Matching succeeded.',
        description: 'Yay!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      navigate(`/collaborate/${roomId}`);
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleMatchRequest = (complexities: readonly QuestionComplexityEnum[], categories: string[]): void => {
    socket?.emit('requestMatch', { userId, complexities, categories });
    setMatchingState(MatchingStateEnum.PENDING);
  };

  const handleCancel: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    socket?.disconnect();
    setMatchingState(MatchingStateEnum.NO_REQUEST);
  };

  return (
    <Center width={'100%'}>
      <Card m={12} p={8} minWidth={'50%'}>
        <IconWithText text={'Request Match'} icon={<FaBoltLightning size={25} />} fontSize={'2xl'} fontWeight="bold" />
        {matchingState === MatchingStateEnum.NO_REQUEST && <MatchingForm handleMatchRequest={handleMatchRequest} />}
        {matchingState === MatchingStateEnum.PENDING && (
          <Stack>
            <Center width={'100%'}>
              <CountdownProgressBar duration={30} onComplete={() => {}} />
            </Center>
            <Center width={'100%'}>
              <form onSubmit={handleCancel}>
                <Button type="submit" colorScheme="teal" leftIcon={<FaExclamation size={20} />}>
                  Cancel matching
                </Button>
              </form>
            </Center>
          </Stack>
        )}
        {matchingState === MatchingStateEnum.MATCHED && <Text>You have been matched!</Text>}
      </Card>
    </Center>
  );
};

export default Matching;
