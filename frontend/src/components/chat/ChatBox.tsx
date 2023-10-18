import React, { useEffect, useState, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useToast, Input, IconButton, VStack, HStack, Box, Text } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { io, type Socket } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { selectUser } from '../../reducers/authSlice';
import { useAppSelector } from '../../reducers/hooks';
import { Message, MyFile, MyFileMetadata } from '../../types/chat/messages';
import { selectAwareness } from '../../reducers/awarenessSlice';
import type { User } from '../../types/users/users';
import './App.css';

const ChatBox: React.FC = () => {
  const toast = useToast();
  const { roomId } = useParams();
  const awareness = useAppSelector(selectAwareness);
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
  // const [receiveProgress, setReceiveProgress] = useState<number>(100);
  // const [sendProgress, setSendProgress] = useState<number>(100);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  // const TRANSFER_SIZE = 1024;

  // Join the room
  const setInitial = (roomId: string, currentUser: User): void => {
    // Emit a request to join the room
    socket.current?.emit('join-room', roomId, currentUser);
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

  // FOR TESTING
  socket.current?.on('joined-room', () => {
    toast({
      title: 'JOINED',
      description: 'joined',
      status: 'error',
      duration: 2000,
      isClosable: true,
    });
  });

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
      socket.current?.emit('chat-message', outMessage);
      setNewMessage('');
    }
  };

  // // Handle file input
  // const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
  //   let filesInput = e.target;
  //   if (filesInput.files && filesInput.files[0]) {
  //     const file = filesInput.files[0];
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       if (reader.result instanceof ArrayBuffer) {
  //         const buffer = new Uint8Array(reader.result);
  //         const outFileMetadata: MyFileMetadata = {
  //           user: currentUser,
  //           filename: file.name,
  //           buffer_size: buffer.length,
  //           time: new Date(),
  //         };
  //         const outFile: MyFile = {
  //           metadata: outFileMetadata,
  //           buffer: buffer,
  //         };
  //         shareFile(outFile);
  //       } else {
  //         toast({
  //           title: 'Issue with file buffer read',
  //           description: 'Invalid file buffer type',
  //           status: 'error',
  //           duration: 2000,
  //           isClosable: true,
  //         });
  //         console.error('Could not read file buffer: Invalid file buffer type');
  //       }
  //     };
  //     reader.readAsArrayBuffer(file);
  //   }
  // };
 
  // // Handle sharing file
  // const shareFile = (file: MyFile): void => {
  //   socket.current?.emit('file-meta', {
  //     metadata: file.metadata,
  //   });

  //   socket.current?.on('fs-share', () => {
  //     let buffer = file.buffer;
  //     let buffer_size = file.metadata.buffer_size;
  //     if (buffer !== null) {
  //       let chunk = buffer.slice(0, TRANSFER_SIZE);
  //       buffer = buffer.slice(TRANSFER_SIZE, buffer.length);
  //       setSendProgress(Math.trunc(((buffer_size - buffer.length) / buffer_size) * 100));
  //       if (chunk.length !== 0) {
  //         socket.current?.emit('file-raw', { chunk: chunk });
  //       } else {
  //         console.log('Sent file successfully');
  //         setFiles([...files, file]);
  //         setSendProgress(0);
  //       }
  //     } else {
  //       toast({
  //         title: 'File buffer is empty',
  //         description: 'File buffer is empty',
  //         status: 'error',
  //         duration: 2000,
  //         isClosable: true,
  //       });
  //       console.error('Could not share file: File buffer is empty');
  //     }
  //   });
  // }; // CONTAINED

  // let sharedFile: {
  //   transmitted?: number;
  //   buffer?: ArrayBuffer[];
  //   metadata?: MyFileMetadata;
  // }; // CONTAINED

  // // metadata get and then send request for transfer
  // socket.current?.on('fs-meta', (metadata: MyFileMetadata) => {
  //   sharedFile.transmitted = 0;
  //   sharedFile.buffer = [];
  //   sharedFile.metadata = metadata;

  //   socket.current?.emit('fs-share', { metadata: metadata });
  // }); // CONTAINED

  // // start receiving and downloading file
  // socket.current?.on('file-raw', (chunk: Uint8Array) => {
  //   sharedFile.buffer?.push(chunk);

  //   if (sharedFile.transmitted && sharedFile.metadata) {
  //     sharedFile.transmitted += chunk.byteLength;
  //     setReceiveProgress(Math.trunc((sharedFile.transmitted / sharedFile.metadata.buffer_size) * 100));
  //     if (sharedFile.transmitted === sharedFile.metadata.buffer_size && sharedFile.buffer) {
  //       const arrayOfArrayBuffers = sharedFile.buffer;
  //       const totalLength = arrayOfArrayBuffers.reduce((acc, buffer) => acc + buffer.byteLength, 0);
  //       const combinedUint8Array = new Uint8Array(totalLength);
  //       let offset = 0;
  //       arrayOfArrayBuffers.forEach((buffer) => {
  //         combinedUint8Array.set(new Uint8Array(buffer), offset);
  //         offset += buffer.byteLength;
  //       });
  //       const receivedFile: MyFile = { metadata: sharedFile.metadata, buffer: combinedUint8Array };
  //       setFiles([...files, receivedFile]);
  //       console.log('Download file: ', receivedFile);
  //       downloadFile(combinedUint8Array, sharedFile.metadata.filename);
  //     }
  //   }
  // }); // CONTAINED

  // function downloadFile(buffer: Uint8Array, fileName: string): void {
  //   const blob = new Blob([buffer]);
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = fileName;
  //   a.style.display = 'none';
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   URL.revokeObjectURL(url);
  // } // Hopefully this works

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
      <div key={currentDate.toLocaleString()} style={{ margin: '5px' }}>
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

  // Format Messages Display
  const fileElements = files.map((file) => {
    return (
      <div key={file.metadata.time.toString()} style={{ margin: '5px' }}>
        {/* Message Bubble */}
        <div className={`chat-bubble ${file.metadata.user?.username === currentUser?.username ? 'right' : 'left'}`}>
          <HStack style={{ width: '100%' }}>
            <div className="user-name" style={{ width: '100%' }}>
              {file.metadata.user?.username}
              {file.metadata.user?.username === currentUser?.username ? ' (Me)' : ''}
            </div>
            <div className="user-name" style={{ width: '100%', textAlign: 'right' }}>
              {formatTime(new Date(file.metadata.time))}
            </div>
          </HStack>
          <div className="user-message">
            <p>{file.metadata.filename}</p>
            <p>{file.metadata.buffer_size}</p>
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
          {messageElements}
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
        </div>
      </VStack>
      <div className="file-input">
        <label htmlFor="file-input">Click here to Select files for sharing</label>
        {/* <input onChange={handleFileChange} type="file" id="file-input" /> */}
        {/* <p>Receive Progress: {receiveProgress}%</p>
        <p>Send Progress: {sendProgress}%</p> */}
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
    </>
  );
};

export default ChatBox;
