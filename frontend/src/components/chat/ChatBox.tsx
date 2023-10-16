import React, { useEffect, useState, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useToast, Input, IconButton, VStack, HStack, Box, Text } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { io, type Socket } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { selectUser } from '../../reducers/authSlice';
import { useAppSelector } from '../../reducers/hooks';
import type { Message } from '../../types/chat/messages';
// import { selectAwareness } from '../../reducers/awarenessSlice';
// import type { User } from '../../types/users/users';
import './App.css';

const ChatBox: React.FC = () => {
  const toast = useToast();
  const { roomId } = useParams();
  // const awareness = useAppSelector(selectAwareness);
  const currentUser = useAppSelector(selectUser);

  const socket = useRef<Socket | null>(null);

  // Create a Socket.IO client instance when the component is initialized
  useEffect(() => {
    const socketIoURL = process.env.REACT_APP_COLLABORATION_SERVICE_SOCKET_IO_BACKEND_URL;

    if (socketIoURL === undefined) {
      // Handle the error
      toast({
        title: 'Server Error',
        description: 'Could not connect to the server',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      console.error('Server Error: Could not connect to the server');
    } else {
      // Initialize the socket variable
      socket.current = io(socketIoURL);

      // Clean up the socket connection when the component unmounts
      return () => {
        socket.current?.disconnect();
      };
    }
  }, []); // Empty dependency array ensures this runs only once.

  const [newMessage, setNewMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  // Set previous messages
  const setInitialMessages = (roomId: string): void => {
    // Emit a request to get the initial language for the room.
    socket.current?.emit('join-room', roomId);

    // Listen for the "initial-messages" event from the Socket.IO server.
    socket.current?.on('initial-messages', (initialMessages: Message[] | null) => {
      // Set the initial messages received from the server.
      if (initialMessages != null) {
        setMessages(initialMessages);
      }
    });
  };

  // Runs once when the component mounts to set the initial messages.
  useEffect(() => {
    if (roomId === undefined) {
      toast({
        title: 'Could not create room',
        description: 'Invalid room ID',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      console.error('Could not create room: Invalid room ID');
    } else {
      setInitialMessages(roomId);
    }
  }, []);

  // Runs whenever a chat message is emitted.
  useEffect(() => {
    // Listen for receive-chat-message event from the Socket.IO server.
    socket.current?.on('receive-chat-message', (message) => {
      // Update chat room with new message received from the Socket.IO server.
      setMessages([...messages, message]);
    });
  }, [messages]);

  const sendMessage = (): void => {
    if (newMessage.trim().length !== 0) {
      const outMessage: Message = {
        user: currentUser,
        text: newMessage,
        time: new Date(), // current timestamp
      };
      socket.current?.emit('chat-message', roomId, outMessage);
      setNewMessage('');
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    sendMessage();
  };

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function formatDate(dateTime: Date): string {
    const formattedDate = dateTime.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }); // Convert Date
    return formattedDate;
  }

  function formatTime(dateTime: Date): string {
    const formattedTime = dateTime.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }); // Convert Time
    return formattedTime;
  }

  // Initialize a variable to keep track of the previous date
  let prevDate = new Date(0);

  const messageElements = messages.map((message) => {
    const currentDate = new Date(message.time);
    const isDifferentDay = formatDate(currentDate) !== formatDate(prevDate);
    const differenceTime = (currentDate.getTime() - prevDate.getTime()) / 1000 / 60;
    const isDifferentTime = differenceTime >= 15;
    prevDate = currentDate;

    return (
      <div key={message.time.toString()} style={{ margin: '5px' }}>
        {/* Insert a date divider if it's a different day */}
        {isDifferentDay && (
          <Box as="span" flex="1" textAlign="center">
            <Text fontWeight="bold">{formatDate(currentDate)}</Text>
          </Box>
        )}
        {isDifferentTime && (
          <Box as="span" flex="1" textAlign="center">
            <Text fontWeight="bold">{formatTime(currentDate)}</Text>
          </Box>
        )}
        <div className={`chat-bubble ${message.user?.username === currentUser?.username ? 'right' : 'left'}`}>
          <HStack style={{ width: '100%' }}>
            <div className="user-name" style={{ width: '100%' }}>
              {message.user?.username}
              {message.user?.username === currentUser?.username ? ' (Me)' : ''}
            </div>
            <div className="user-name" style={{ width: '100%', textAlign: 'right' }}>
              {formatTime(new Date(message.time))}
            </div>
          </HStack>
          <div className="user-message">{message.text}</div>
        </div>
      </div>
    );
  });

  return (
    <>
      <VStack as="div" style={{ overflowY: 'auto', width: '100%' }}>
        <div className="messages-wrapper" style={{ width: '100%' }}>
          {messageElements}
        </div>
        <div className="message__status">
          {/* Possibility of adding status of messages */}
          <div ref={lastMessageRef} />
        </div>
      </VStack>
      <form className="form" onSubmit={handleSubmit} style={{ width: '100%' }}>
        <HStack as="div" style={{ width: '100%' }}>
          <Input
            size="md"
            type="text"
            placeholder="Share your thoughts"
            className="form-input__input"
            value={newMessage}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setNewMessage(e.target.value);
            }}
          />
          <IconButton
            type="submit"
            icon={<CheckIcon />}
            colorScheme="teal"
            aria-label="Send"
            size="md"
            variant="solid"
          ></IconButton>
        </HStack>
      </form>
    </>
  );
};

export default ChatBox;
