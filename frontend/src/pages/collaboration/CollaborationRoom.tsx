import { Box, Flex, useColorModeValue, Button, Spacer, useToast } from '@chakra-ui/react';
import { Allotment } from 'allotment';
import CodeEditor from '../../components/code/CodeEditor';
import CollaboratorUsers from './CollaboratorUsers';
import RoomInfo from './RoomInfo';
import UserTab from './UserTab';
import React, { useContext, useState } from 'react';
import CollaborationQuestion from './CollaborationQuestion';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../reducers/hooks';
import { selectUser } from '../../reducers/authSlice';
import { SocketContext, SocketProvider } from '../../context/socket';

const CollaborationRoom: React.FC = () => {
  const toast = useToast();
  const editorTheme = useColorModeValue('light', 'vs-dark');
  const [showUserTab, toggleShowUserTab] = useState(false);
  const user = useAppSelector(selectUser);
  const { socket } = useContext(SocketContext);
  const roomId = useParams<{ roomId: string }>();

  const navigate = useNavigate();

  const handleNextQuestion = (): void => {
    if (user === null) {
      return;
    }
    socket?.emit('user-agreed-next', roomId, user.id);
    toast({
      title: 'Both users have agreed to go to the next question',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleEndSession = (): void => {
    if (user === null) {
      return;
    }
    socket?.emit('user-agreed-end', roomId, user.id);
    toast({
      title: 'Both users have agreed to end the session',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  socket?.on('both-users-agreed-next', () => {
    // todo
    socket?.emit('set-question', 1);
  });

  socket?.on('both-users-agreed-end', () => {
    navigate('/');
  });

  return (
    <SocketProvider>
      <Flex mt={4} mx={4} justifyContent="space-between">
        <RoomInfo />
        <Button onClick={handleNextQuestion} mx={4}>
          Next Question
        </Button>
        <Button onClick={handleEndSession}>End Session</Button>
        <Spacer />
        <CollaboratorUsers
          onUserTabToggle={() => {
            toggleShowUserTab(!showUserTab);
          }}
        />
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
          <Allotment.Pane visible={showUserTab}>
            <Box as="div" style={{ overflowY: 'auto', height: '100%' }}>
              <UserTab />
            </Box>
          </Allotment.Pane>
        </Allotment>
      </Box>
    </SocketProvider>
  );
};

export default CollaborationRoom;
