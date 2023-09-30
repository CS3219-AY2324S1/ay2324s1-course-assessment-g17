import React, { useEffect, useState } from 'react';
import { Card, Center, Spinner, useToast } from '@chakra-ui/react';
import { io, type Socket } from 'socket.io-client';
import type { QuestionComplexityEnum } from '../../types/questions/questions';
import { FaBoltLightning } from 'react-icons/fa6';
import IconWithText from '../../components/content/IconWithText';
import MatchingForm from './MatchingForm';

enum MatchingStateEnum {
  NO_REQUEST,
  PENDING,
  MATCHED,
}

const Matching: React.FC<{ userId: number }> = ({ userId }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const toast = useToast();
  const [matchingState, setMatchingState] = useState<MatchingStateEnum>(MatchingStateEnum.NO_REQUEST);

  useEffect(() => {
    const newSocket = io('http://localhost:9000');

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

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleMatchRequest = (complexities: QuestionComplexityEnum[], categories: string[]): void => {
    socket?.emit('requestMatch', { userId, complexities, categories });
    setMatchingState(MatchingStateEnum.PENDING);
  };

  return (
    <Center width={'100%'}>
      <Card m={12} p={8} minWidth={'50%'}>
        <IconWithText text={'Request Match'} icon={<FaBoltLightning size={25} />} fontSize={'2xl'} fontWeight="bold" />
        {matchingState === MatchingStateEnum.NO_REQUEST && <MatchingForm handleMatchRequest={handleMatchRequest} />}
        {matchingState === MatchingStateEnum.PENDING && (
          <Center>
            <Spinner size={'xl'} />
          </Center>
        )}
      </Card>
    </Center>
  );
};

export default Matching;
