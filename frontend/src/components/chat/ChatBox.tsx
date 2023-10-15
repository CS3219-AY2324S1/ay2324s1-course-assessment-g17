import React, { useEffect, useState, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useToast, Input, IconButton, VStack } from '@chakra-ui/react';
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

  return (
    <>
      <VStack as="div" style={{ overflowY: 'auto', height: '100%', padding: '16px', width: '100%' }}>
        <div className="messages-wrapper" style={{ width: '100%' }}>
          {messages.map((message) => (
            <div
              className={`chat-bubble${message.user?.username === currentUser?.username ? '-right' : ''}`}
              key={message.time.toString()}
            >
              {/* <img
                className="chat-bubble__left"
                src={message.avatar}
                alt="user avatar"
              /> */}
              {/* <div className="chat-bubble__left"> */}
              <p className="user-name">{message.user?.username}</p>
              <p className="user-message">{message.text}</p>
              {/* </div> */}
            </div>
          ))}
        </div>
        <div className="message__status">
          {/* Possibility of adding status of messages */}
          <div ref={lastMessageRef} />
        </div>
      </VStack>
      <form className="form" onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Input
          type="text"
          placeholder="Share your thoughts"
          className="form-input__input"
          value={newMessage}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setNewMessage(e.target.value);
          }}
        />
        <IconButton type="submit" colorScheme="teal" aria-label="" size="lg" icon={<CheckIcon />} />
      </form>
    </>
  );
};

export default ChatBox;
