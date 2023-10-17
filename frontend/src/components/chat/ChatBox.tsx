import React, { useEffect, useState, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useToast, Input, IconButton, VStack, HStack, Box, Text } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { io, type Socket } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { selectUser } from '../../reducers/authSlice';
import { useAppSelector } from '../../reducers/hooks';
import type { Message, File, FileMetadata } from '../../types/chat/messages';
import { selectAwareness } from '../../reducers/awarenessSlice';
import type { User } from '../../types/users/users';
import './App.css';
import fileDownload from 'js-file-download'
import { current } from '@reduxjs/toolkit';

const ChatBox: React.FC = () => {
  const toast = useToast();
  const { roomId } = useParams();
  const awareness = useAppSelector(selectAwareness);
  const currentUser = useAppSelector(selectUser);

  const socket = useRef<Socket | null>(null);

  // Create a Socket.IO client instance when the component is initialized
  useEffect(() => {
    const socketIoURL = process.env.REACT_APP_COLLABORATION_SERVICE_SOCKET_IO_BACKEND_URL;

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
  const [files, setFiles] = useState<File[]>([]);
  const [receiveProgress, setReceiveProgress] = useState<number>(100);
  const [sendProgress, setSendProgress] = useState<number>(100);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const TRANSFER_SIZE = 1024;

  // Join the room
  const setInitial = (roomId: string, currentUser: User): void => {
    // Emit a request to join the room
    socket.current?.emit('join-room', roomId, currentUser);

    // // Listen for the "initial-messages" event from the Socket.IO server.
    // socket.current?.on('joined', (joinedUser: User) => {
    //   // Set the initial messages received from the server.
    //   if (initialMessages != null) {
    //     setMessages(initialMessages);
    //   }
    // });
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

  // Runs whenever a chat message is emitted.
  socket.current?.on('receive-chat-message', (message) => {
    setMessages([...messages, message]);
  });

  // Scroll to bottom every time messages change
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
  
  // Handle file input
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let filesInput  = e.target;
    if (filesInput.files && filesInput.files[0]) {
      const file = filesInput.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (reader.result instanceof ArrayBuffer) {
          const buffer = new Uint8Array(reader.result);
          const outFileMetadata: FileMetadata = {
            user: currentUser,
            filename: file.name,
            buffer_size: buffer.length,
            time: new Date(),
          }
          const outFile: File = {
            metadata: outFileMetadata,
            buffer: buffer,
          }
          shareFile(outFile);
        } else {
          toast({
            title: 'Issue with file buffer read',
            description: 'Invalid file buffer type',
            status: 'error',
            duration: 2000,
            isClosable: true,
          });
          console.error('Could not read file buffer: Invalid file buffer type');
        }
        
      }
    }

  // Handle sharing file
  const shareFile = (file: File): void => {
		socket.current?.emit("file-meta", { 
      metadata: file.metadata
    });
		
		socket.current?.on("fs-share", () => {
      let buffer = file.buffer;
      let buffer_size = file.metadata.buffer_size;
      if (buffer !== null) {
        let chunk = buffer.slice(0, TRANSFER_SIZE);
        buffer = buffer.slice(TRANSFER_SIZE, buffer.length);
        setSendProgress(Math.trunc(
          ((buffer_size - buffer.length) / buffer_size * 100)
        ));
        if(chunk.length !== 0){
          
          socket.current?.emit("file-raw", { chunk: chunk });
        
        } else {
          console.log("Sent file successfully");
          setFiles([...files, file]);
          setSendProgress(0);
        }
      } else {
        toast({
          title: 'File buffer is empty',
          description: 'File buffer is empty',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
        console.error('Could not share file: File buffer is empty');
      }
		});
	}
  
  let sharedFile: {
    transmitted?: number;
    buffer?: ArrayBuffer[];
    metadata?: FileMetadata;
  };

  // metadata get and then send request for transfer
  socket.current?.on("fs-meta", (metadata: FileMetadata) => {
    sharedFile.transmitted = 0;
    sharedFile.buffer = [];
    sharedFile.metadata = metadata;
    socket.current?.emit("fs-share", { metadata: metadata })
  });

  // start receiving and downloading file
  socket.current?.on("file-raw", (chunk: Uint8Array) => {
    sharedFile.buffer?.push(chunk);
    
    if (sharedFile.transmitted && sharedFile.metadata) {
      sharedFile.transmitted += chunk.byteLength;
      setReceiveProgress(Math.trunc((
        sharedFile.transmitted / sharedFile.metadata.buffer_size) * 100)
      );
      if (sharedFile.transmitted === sharedFile.metadata.buffer_size) {
        console.log("Download file: ", sharedFile);
        fileDownload(sharedFile.buffer, sharedFile.metadata.filename);
      }
    }
  });

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
  // Initialize a variable to keep track of the previous date
  let prevDate = new Date(0);

  // Format Messages Display
  const messageElements = messages.map((message) => {
    const currentDate = new Date(message.time);
    const isDifferentDay = formatDate(currentDate) !== formatDate(prevDate);
    const differenceTime = (currentDate.getTime() - prevDate.getTime()) / 1000 / 60;
    const isDifferentTime = differenceTime >= 15;
    prevDate = currentDate;
    return (
      <div key={message.time.toString()} style={{ margin: '5px' }}>
        {/* Insert a date/time divider if different day / time has passed */}
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
        {/* Message Bubble */}
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

  // Actual return begins here
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
}};

export default ChatBox;
