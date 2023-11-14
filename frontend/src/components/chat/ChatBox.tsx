import React, { useEffect, useState, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useToast, Input, IconButton, HStack, Box, Text, useColorModeValue } from '@chakra-ui/react';
import { CheckIcon, AttachmentIcon, DownloadIcon } from '@chakra-ui/icons';
import { io, type Socket } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { selectUser } from '../../reducers/authSlice';
import { useAppSelector } from '../../reducers/hooks';
import type { Message, MyFile } from '../../types/chat/messages';
import type { User } from '../../types/users/users';
import { Allotment } from 'allotment';
import type { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import './App.css';

const ChatBox: React.FC = () => {
  const toast = useToast();
  const roomId = useParams<{ roomId: string }>().roomId;
  const currentUser = useAppSelector(selectUser);
  const bgColorClass = useColorModeValue('chat-bubble', 'chat-bubble-dark');
  const usernameClass = useColorModeValue('user-name', 'user-name-dark');
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
      socket.current = io(socketIoURL, {
        path: process.env.REACT_APP_CHAT_SERVICE_PATH ?? '/socket.io/',
        transports: ['websocket'],
      });
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

    // Listen to users joining
    socket.current?.on('joined-room', (joinedUser: User) => {
      toast({
        title: `${joinedUser.username} joined room`,
        description: '',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    });

    // Listen to users leaving
    socket.current?.on('user-disconnect', (disconnectedUser: string) => {
      toast({
        title: `User ${disconnectedUser} has left the room`,
        description: '',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    });

    // Listen to users error
    socket.current?.on('error', ({ errorMsg }) => {
      toast({
        title: 'Connect to chat service failed.',
        description: `${errorMsg}. Refresh your page if this is an error.`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    });

    const handleReceiveChatMessage = (message: Message): void => {
      setMessages((prev) => [...prev, message]);
    };
    socket.current?.on('receive-chat-message', handleReceiveChatMessage);

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
  }, [socket]);

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
      socket.current?.emit('chat-message', roomId, outMessage);
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

  function shouldDisplayDateTime(currentDate: Date, prevMessageDate: Date): [boolean, boolean] {
    const isDifferentDay = formatDate(currentDate) !== formatDate(prevMessageDate);
    const differenceTime = (currentDate.getTime() - prevMessageDate.getTime()) / 1000 / 60;
    const isDifferentTime = differenceTime >= 15;
    return [isDifferentDay, isDifferentTime];
  }

  // Format and display messages
  const messageList = (): ReactJSXElement => {
    let prevDate = new Date(0);

    // Message component to display individual messages
    const messageElement = (message: Message): ReactJSXElement => {
      return (
        <div className={`${bgColorClass} ${message.user?.username === currentUser?.username ? 'right' : 'left'}`}>
          <HStack style={{ width: '100%' }}>
            <div className={usernameClass} style={{ width: '100%' }}>
              {message.user?.username}
              {message.user?.username === currentUser?.username ? ' (Me)' : ''}
            </div>
            <div className={usernameClass} style={{ width: '100%', textAlign: 'right' }}>
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
          const [isDifferentDay, isDifferentTime] = shouldDisplayDateTime(currentDate, prevDate);
          prevDate = currentDate;

          return (
            <div key={index} style={{ margin: '5px' }}>
              <Box as="span" flex="1" textAlign="center">
                {isDifferentDay && <Text fontWeight="semibold">{formatDate(currentDate)}</Text>}
                {isDifferentTime && <Text fontWeight="semibold">{formatTime(currentDate)}</Text>}
              </Box>
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

    // Check if the file size is below 10MB (10 * 1024 * 1024 bytes)
    if (file.size <= 10 * 1024 * 1024) {
      const reader = new FileReader();

      reader.onload = () => {
        const dataURL = reader.result as string;
        const outFile: MyFile = {
          user: currentUser,
          dataURL,
          filename: file.name,
          time: new Date(), // current timestamp
        };
        socket.current?.emit('upload', roomId, outFile);

        toast({
          title: `Uploaded file ${outFile.filename}`,
          description: '',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      };

      reader.readAsDataURL(file);
    } else {
      // Notify the user that the file is too large
      toast({
        title: 'File Size Exceeds 10MB',
        description: 'Please select a file smaller than 10MB.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }

    // After handling the file in either case, clear the selection
    clearFileSelection();
  };

  // Function to clear the file selection
  const clearFileSelection = (): void => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (fileRef?.current) {
      fileRef.current.value = ''; // Reset the input value to clear the selection
    }
  };

  // Format File Display
  const fileList = (): ReactJSXElement => {
    let prevDate = new Date(0);

    const fileElement = (file: MyFile): ReactJSXElement => {
      return (
        <div className={`${bgColorClass} ${file.user?.username === currentUser?.username ? 'right' : 'left'}`}>
          <HStack style={{ width: '100%' }}>
            <div className={usernameClass} style={{ width: '100%' }}>
              {file.user?.username}
              {file.user?.username === currentUser?.username ? ' (Me)' : ''}
            </div>
            <div className={usernameClass} style={{ width: '100%', textAlign: 'right' }}>
              {formatTime(file.time)}
            </div>
          </HStack>
          <div className="user-message">
            <HStack style={{ width: '100%' }}>
              <div>
                <a href={file.dataURL} download={file.filename}>
                  <IconButton
                    type="button"
                    variant="solid"
                    backgroundColor={file.user?.username === currentUser?.username ? 'teal' : 'lightgrey'}
                    color={file.user?.username === currentUser?.username ? 'white' : 'black'}
                    icon={<DownloadIcon />}
                    aria-label="Download"
                    size="md"
                  ></IconButton>
                </a>
              </div>
              <div style={{ width: '100%' }}>
                <Text fontWeight="semibold">{file.filename}</Text>
              </div>
            </HStack>
          </div>
        </div>
      );
    };

    return (
      <div>
        {files.map((file, index) => {
          const currentDate = new Date(file.time);
          const [isDifferentDay, isDifferentTime] = shouldDisplayDateTime(currentDate, prevDate);
          prevDate = currentDate;

          return (
            <div key={index} style={{ margin: '5px' }}>
              <Box as="span" flex="1" textAlign="center">
                {isDifferentDay && <Text fontWeight="semibold">{formatDate(currentDate)}</Text>}
                {isDifferentTime && <Text fontWeight="semibold">{formatTime(currentDate)}</Text>}
              </Box>
              {fileElement(file)}
            </div>
          );
        })}
      </div>
    );
  };

  // Actual return begins here
  return (
    <>
      <Text fontWeight="bold">Chat Messages and Shared Files</Text>

      <Allotment defaultSizes={[7, 3]} vertical={true}>
        <Allotment.Pane>
          <div style={{ overflow: 'auto', height: '100%', width: '100%' }}>
            <Box width="100%" height="100%" alignSelf="flex-start" borderRadius={8}>
              <div className="messages-wrapper" style={{ width: '100%' }}>
                {messageList()}
                <div ref={lastMessageRef} />
              </div>
            </Box>
          </div>
        </Allotment.Pane>
        <Allotment.Pane>
          <div style={{ overflow: 'auto', height: '100%', width: '100%' }}>
            <Box width="100%" height="100%" alignSelf="flex-start" borderRadius={8}>
              <div className="messages-wrapper" style={{ width: '100%' }}>
                {fileList()}
                <div ref={lastFileRef} />
              </div>
            </Box>
          </div>
        </Allotment.Pane>
      </Allotment>

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
              isRound={true}
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
