import React, { useEffect } from 'react';
import { Card, Text } from '@chakra-ui/react';
import { BiSad } from 'react-icons/bi';
import { io } from 'socket.io-client';
import IconWithText from '../../components/content/IconWithText';

const Matching: React.FC = () => {
  useEffect(() => {
    const socket = io('http://localhost:9000');

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Card m={12} p={8}>
      <IconWithText text={'Not implemented yet!'} icon={<BiSad />} fontSize={'2xl'} fontWeight="bold" />
      <Text>Look at console: You should see &quot;Connected to server.&quot;</Text>
    </Card>
  );
};

export default Matching;
