import React, { useEffect, useState, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useToast } from '@chakra-ui/react';
import { io, type Socket } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { selectUser } from '../../reducers/authSlice';
import { useAppSelector } from '../../reducers/hooks';
import type { Message } from '../../types/chat/messages';
import type { User } from '../../types/users/users';

const Chat: React.FC = () => {
  const toast = useToast();
  const { roomId } = useParams();
  const user = useAppSelector(selectUser);

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
  const [typingStatus, setTypingStatus] = useState<Set<User> | null>(null);
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

    // Listen for the "initial-typing" event from the Socket.IO server.
    socket.current?.on('initial-typing', (initialTyping: Set<User> | null) => {
      // Set the initial messages received from the server.
      if (initialTyping != null) {
        setTypingStatus(initialTyping);
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

  useEffect(() => {
    if (newMessage.trim() !== '') {
      handleTyping();
    } else {
      handleStopTyping();
    }
  }, [newMessage]);

  const sendMessage = (): void => {
    if (newMessage.trim().length !== 0) {
      const outMessage: Message = {
        user: user,
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
    socket.current?.on('typingResponse', (typingUsers: Set<User>) => {
      setTypingStatus(typingUsers);
    });
  }, [socket]);

  // useEffect(() => {
  //   socket.current?.on('stopTypingResponse', (typinguser: User) => {
  //     setTypingStatus((prevTypingStatus) => {
  //       const updatedTypingStatus = new Set(prevTypingStatus);
  //       updatedTypingStatus.delete(typinguser);
  //       return updatedTypingStatus;
  //     });
  //   });
  // }, [socket]);

  const handleTyping = (): void => {
    socket.current?.emit('typing', roomId, user);
  };

  const handleStopTyping = (): void => {
    socket.current?.emit('stopTyping', roomId, user);
  };

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div>
      <>
        <div className="message__container">
          {messages.map((message) => (
            <div className="message__chats" key={message.time.toString()}>
              <div className="sender__name">{message.user?.username}</div>
              <div className="message__sender">
                <p>{message.text}</p>
              </div>
            </div>
          ))}

          <div className="message__status">
            {typingStatus !== null &&
              Array.from(typingStatus).map((item: User) => (
                <div key={item.username}>
                  <p>{item.username} is typing...</p>
                </div>
              ))}
          </div>
          <div ref={lastMessageRef} />
        </div>

        <div className="chat__footer">
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Write message"
              className="message"
              value={newMessage}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setNewMessage(e.target.value);
              }}
            />
            <button className="sendBtn">Send</button>
          </form>
        </div>
      </>
    </div>
  );
};

export default Chat;
