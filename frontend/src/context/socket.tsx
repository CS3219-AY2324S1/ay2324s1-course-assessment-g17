import { useToast } from '@chakra-ui/react';
import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import io, { type Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

interface SocketProviderProps {
  children: ReactNode;
}

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const toast = useToast();

  // Create a Socket.IO client instance when the component is initialized
  const socketIoURL = process.env.REACT_APP_COLLABORATION_SERVICE_SOCKET_IO_BACKEND_URL;

  useEffect(() => {
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
      const socket = io(socketIoURL);
      setSocket(socket);
    }

    // Clean up the socket connection when the component unmounts
    return () => {
      socket?.disconnect();
    };
  }, []); // Empty dependency array ensures this runs only once.

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export { SocketContext, SocketProvider };
