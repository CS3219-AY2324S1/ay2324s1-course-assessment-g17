import React, { useEffect, useState, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useToast, Input, IconButton, VStack, HStack, Box, Text } from '@chakra-ui/react';
import { CheckIcon, AttachmentIcon } from '@chakra-ui/icons';
import { io, type Socket } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { selectUser } from '../../reducers/authSlice';
import { useAppSelector } from '../../reducers/hooks';
import type { Message, MyFile } from '../../types/chat/messages';
import type { User } from '../../types/users/users';
import './App.css';
import type { ReactJSXElement } from '@emotion/react/types/jsx-namespace';

const ChatBox: React.FC = () => {
  const toast = useToast();
  const { roomId } = useParams();
  const currentUser = useAppSelector(selectUser);

  const socket = useRef<Socket | null>(null);

  // Create a Socket.IO client instance when the component is initialized
  useEffect(() => {
    const socketIoURL = process.env.REACT_APP_CHAT_SERVICE_SOCKET_IO_BACKEND_URL;

    if (socketIoURL === undefined) {
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
  const [files, setFiles] = useState<MyFile[]>([]);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const lastFileRef = useRef<HTMLDivElement | null>(null);

  // Join the room
  useEffect(() => {
    const setInitial = (roomId: string, currentUser: User): void => {
      // Emit a request to join the room
      socket.current?.emit('join-room', roomId, currentUser);
    };
    if (roomId === undefined) {
      toast({
        title: 'Could not create room',
        description: 'Invalid room ID',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      console.error('Could not create room: Invalid room ID');
    } else if (currentUser == null) {
      toast({
        title: 'Could not create room',
        description: 'Invalid user ID',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      console.error('Could not create room: Invalid user ID');
    } else {
      setInitial(roomId, currentUser);
    }
  }, []);

  // Receive the user has joined the room
  // useEffect(() => {
  socket.current?.on('joined-room', (joinedUser: User) => {
    toast({
      title: `${joinedUser.username} joined room`,
      description: '',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  });
  // }, []);

  // Runs whenever a chat message is emitted.
  useEffect(() => {
    const handleReceiveChatMessage = (message: Message): void => {
      setMessages((prev) => [...prev, message]);
      toast({
        title: 'sss',
        description: '',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    };
    socket.current?.on('receive-chat-message', handleReceiveChatMessage);

    // return () => {
    //   socket.current?.off('receive-chat-message', handleReceiveChatMessage);
    // };
  }, []);

  // Scroll to bottom every time messages change
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Scroll to bottom every time messages change
  useEffect(() => {
    lastFileRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [files]);

  // Handle message submit
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    sendMessage();
  };

  // Send message
  const sendMessage = (): void => {
    if (newMessage.trim().length !== 0) {
      const outMessage: Message = {
        user: currentUser,
        text: newMessage,
        time: new Date(), // current timestamp
      };
      socket.current?.emit('chat-message', outMessage);
      setNewMessage('');
    }
  };

  // Format Date from Message
  function formatDate(dateTime: Date): string {
    const formattedDate = dateTime.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return formattedDate;
  }
  // Format Time from Message
  function formatTime(dateTime: Date): string {
    const formattedTime = dateTime.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
    return formattedTime;
  }

  // Format and display messages
  const messageList = (): ReactJSXElement => {
    let prevMessageDate = new Date(0);

    function shouldDisplayDateTime(currentDate: Date, prevMessageDate: Date): [boolean, boolean] {
      const isDifferentDay = formatDate(currentDate) !== formatDate(prevMessageDate);
      const differenceTime = (currentDate.getTime() - prevMessageDate.getTime()) / 1000 / 60;
      const isDifferentTime = differenceTime >= 15;
      return [isDifferentDay, isDifferentTime];
    }

    // Message component to display individual messages
    const messageElement = (message: Message): ReactJSXElement => {
      return (
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
      );
    };

    return (
      <div>
        {messages.map((message, index) => {
          const currentDate = new Date(message.time);
          const [isDifferentDay, isDifferentTime] = shouldDisplayDateTime(currentDate, prevMessageDate);
          prevMessageDate = currentDate;

          return (
            <div key={index} style={{ margin: '5px' }}>
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
              {messageElement(message)}
            </div>
          );
        })}
      </div>
    );
  };

  const fileRef = useRef<HTMLInputElement | null>(null);

  // select file
  const selectFile = (): void => {
    fileRef.current?.click();
  };

  // send file
  const fileSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file == null) return;

    const reader = new FileReader();

    reader.onload = () => {
      const dataURL = reader.result as string;
      const outFile: MyFile = {
        user: currentUser,
        dataURL,
        filename: file.name,
        time: new Date(), // current timestamp
      };
      socket.current?.emit('upload', outFile);

      toast({
        title: `Uploaded file ${outFile.filename}`,
        description: '',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      // After handling the file, clear the selection
      clearFileSelection();
    };

    reader.readAsDataURL(file);
  };

  // Function to clear the file selection
  const clearFileSelection = (): void => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (fileRef?.current) {
      fileRef.current.value = ''; // Reset the input value to clear the selection
    }
  };

  // Add the event listener when the component mounts
  useEffect(() => {
    const handleFileReceive = (outFile: MyFile): void => {
      // Handle the received file data
      toast({
        title: `Received file ${outFile.filename}`,
        description: '',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setFiles((prev) => [...prev, outFile]);
    };

    socket.current?.on('file-receive', handleFileReceive);

    // return () => {
    //   socket.current?.off('file-receive', handleFileReceive);
    // };
  }, []);

  // Format File Display
  let count = 0;
  const fileElements = files.map((file, index) => {
    const currentDate = new Date(file.time);
    count += 1;
    return (
      <div key={index} style={{ margin: '5px' }}>
        {/* File Bubble */}
        <div className={`chat-bubble ${file.user?.username === currentUser?.username ? 'right' : 'left'}`}>
          <HStack style={{ width: '100%' }}>
            <div className="user-name" style={{ width: '100%' }}>
              {file.user?.username}
              {file.user?.username === currentUser?.username ? ' (Me)' : ''}
            </div>
            <div className="user-name" style={{ width: '100%', textAlign: 'right' }}>
              {formatTime(currentDate)}
            </div>
          </HStack>
          <div className="user-message">
            <a href={file.dataURL} download={file.filename}>
              {count} {file.filename}
            </a>
          </div>
        </div>
      </div>
    );
  });

  // Actual return begins here
  return (
    <>
      <VStack as="div" style={{ overflowY: 'auto', width: '100%' }}>
        <div className="messages-wrapper" style={{ width: '100%' }}>
          {messageList()}
        </div>
        <div className="message__status">
          {/* Possibility of adding status of messages */}
          <div ref={lastMessageRef} />
        </div>
      </VStack>
      {/* { currentUser?.username } */}
      <VStack as="div" style={{ overflowY: 'auto', width: '100%' }}>
        <div className="messages-wrapper" style={{ width: '100%' }}>
          {fileElements}
          <div className="message__status">
            {/* Possibility of adding status of files */}
            <div ref={lastFileRef} />
          </div>
        </div>
      </VStack>
      <HStack as="div" style={{ width: '100%' }}>
        <div>
          <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={fileSelected} />
          <IconButton
            type="button"
            icon={<AttachmentIcon />}
            aria-label="Attach File"
            size="md"
            variant="solid"
            onClick={selectFile}
          />
        </div>
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
      </HStack>
    </>
  );
};

export default ChatBox;
