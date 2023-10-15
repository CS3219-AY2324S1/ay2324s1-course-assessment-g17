import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { Server } from "socket.io";
import { startRabbitMQ } from "./consumer";
import cors from "cors";
import { EditorLanguageEnum } from '../../frontend/src/types/code/languages';
import { Message } from '../../frontend/src/types/chat/messages';
import { User } from '../../frontend/src/types/users/users';

const FRONTEND_URL = process.env.FRONTEND_URL as string;
const SOCKET_IO_PORT = process.env.SOCKET_IO_PORT as string;

const setupWSConnection = require("y-websocket/bin/utils").setupWSConnection;

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const server = createServer((_request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Binded");
});

const wss = new WebSocketServer({ server: server });

function onError(error: any) {
  console.log("error", error);
}

function onListening() {
  console.log("Listening");
}

server.on("error", onError);
server.on("listening", onListening);

// Handle code editor.
wss.on("connection", (ws, req) => {
  setupWSConnection(ws, req);
  console.log("connection");
});

// Create a separate server for Socket.IO.
const app = express();
app.use(
  cors({ origin: FRONTEND_URL, optionsSuccessStatus: 200, credentials: true }),
);
const httpServer = createServer(app);

// Create a Socket.IO instance HTTP server.
const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL,
  },
}); 

httpServer.listen(SOCKET_IO_PORT, () => {
  console.log(`Socket.io server is listening on http://localhost:${SOCKET_IO_PORT}`);
});

interface RoomLanguages {
  [roomId: string]: EditorLanguageEnum;
}
interface RoomMessages {
  [roomId: string]: Message[];
}
interface RoomTyping {
  [roomId: string]: User[];
}

// Store the selected language for each room.
const roomLanguages: RoomLanguages = {};
// Store the messages for each room.
const roomMessages: RoomMessages = {};
// Store thr typing users for each room.
const roomTyping: RoomTyping = {};

// Handle other collaboration features.
io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  // Listen for room joining.
  socket.on('join-room', (roomId) => {
    // Join the user to the specified room.
    socket.join(roomId);

    // Provide the client with the previously selected language for that room.
    const initialLanguage = roomLanguages[roomId] || EditorLanguageEnum.javascript;
    // Provide the client with previously sent messages to the room
    const initialMessages = roomMessages[roomId]
    // Provide the client with currently typing users to the room
    const initialTyping = roomTyping[roomId]
    
    // Send the initial language to this user.
    socket.emit('initial-language', initialLanguage);
    // Send the initial messages to this user.
    socket.emit('initial-messages', initialMessages);
    // Send the initial typing to this user.
    socket.emit('initial-typing', initialTyping);
  }); 

  // Listen for language changes.
  socket.on('language-change', (roomId: string, newLanguage: EditorLanguageEnum) => {
    // Update the selected language for the room.
    roomLanguages[roomId] = newLanguage;
    // Broadcast this change to all connected users in this room.
    io.to(roomId).emit('receive-language-change', newLanguage);
  });

  // Listen for chat messages.
  socket.on('chat-message', (roomId: string, message: Message) => {
    // Broadcast the message to all connected clients.
    if (!(roomId in roomMessages)) {
      roomMessages[roomId] = [];
    }
    roomMessages[roomId] = [...roomMessages[roomId], message]; // Append the new message
    io.emit('receive-chat-message', message);
  });

  // Listen for chat messages.
  socket.on('typing', (roomId: string, user: User) => {
    if (!(roomId in roomTyping)) {
      roomTyping[roomId] = [];
    }
    if (!roomTyping[roomId].includes(user)) {
      roomTyping[roomId] = [...roomTyping[roomId], user]; // Append the new message
    }
    // Broadcast the message to all connected clients.
    io.emit('typingResponse', user);
  });

  // Listen for chat messages.
  socket.on('stopTyping', (roomId: string, user: User) => {
    if (!(roomId in roomTyping)) {
      roomTyping[roomId] = [];
    }
    roomTyping[roomId] = roomTyping[roomId].filter((item) => item !== user);
    // Broadcast the message to all connected clients.
    io.emit('stopTypingResponse', user);
  });

  // Handle user disconnection.
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

startRabbitMQ();
