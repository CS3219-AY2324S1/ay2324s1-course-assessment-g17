import { Button, useToast } from '@chakra-ui/react';

import React, { useContext } from 'react';
import { SocketContext } from '../../context/socket';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../reducers/hooks';
import { selectUser } from '../../reducers/authSlice';

const NextQuestion: React.FC = () => {
  const { socket } = useContext(SocketContext);
  const toast = useToast();
  const roomId = useParams<{ roomId: string }>().roomId;
  const user = useAppSelector(selectUser);
  const handleNextQuestion = (): void => {
    console.log('handleNextQuestion');
    console.log('socket:', socket);
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
  };

  return (
    <>
      <Button onClick={handleNextQuestion} mx={4}>
        Next Question
      </Button>
    </>
  );
};

export default NextQuestion;
