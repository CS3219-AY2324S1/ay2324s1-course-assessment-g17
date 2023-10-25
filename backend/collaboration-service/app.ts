import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { Server } from "socket.io";
import { startRabbitMQ } from "./consumer";
import {
  checkAuthorisedUser,
  getFirstQuestion,
  getPairIds,
  getSecondQuestion,
} from "./controllers/pair";
import cors from "cors";
import { EditorLanguageEnum } from "../../frontend/src/types/code/languages";
const FRONTEND_URL = process.env.FRONTEND_URL as string;
const app = express();
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

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

const httpServer = createServer(app);

// Create a Socket.IO instance HTTP server.
const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL,
  },
});

httpServer.listen(SOCKET_IO_PORT, () => {
  console.log(
    `Socket.io server is listening on http://localhost:${SOCKET_IO_PORT}`,
  );
});

app.get("/api/check-authorization", checkAuthorisedUser);
app.get("/api/get-first-question", getFirstQuestion);
app.get("/api/get-second-question", getSecondQuestion);
app.get("/api/get-pair-ids", getPairIds);
interface RoomLanguages {
  [roomId: string]: EditorLanguageEnum;
}

// Store the selected language for each room.
const roomLanguages: RoomLanguages = {};

interface RoomCurrentQuestion {
  [roomId: string]: number;
}

export const roomCurrentQuestion: RoomCurrentQuestion = {};

interface UsersAgreedNext {
  [roomId: string]: Record<string, boolean>;
}

const usersAgreedNext: UsersAgreedNext = {};

interface UsersAgreedEnd {
  [roomId: string]: Record<string, boolean>;
}

const usersAgreedEnd: UsersAgreedEnd = {};

// Handle other collaboration features.
io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  // Listen for room joining.
  socket.on("join-room", (roomId: string, username?: string) => {
    // Join the user to the specified room.
    socket.join(roomId);

    // Provide the client with the previously selected language for that room.
    const initialLanguage =
      roomLanguages[roomId] || EditorLanguageEnum.javascript;
    // Send the initial language to this user.
    socket.emit("initial-language", initialLanguage);

    const initialQuestionId = roomCurrentQuestion[roomId];
    if (initialQuestionId) socket.emit("set-question", initialQuestionId);

    // Attach user's username and roomId to this connection
    socket.data.username = username;
    socket.data.roomId = roomId;
  
    // Broadcast to all connected users that this user has joined the room
    io.to(roomId).emit("user-join", username);
  });

  socket.on("user-agreed-next", (roomId, userId) => {
    usersAgreedNext[roomId] = usersAgreedNext[roomId] || {};
    usersAgreedNext[roomId][userId] = true;
    if (Object.keys(usersAgreedNext[roomId]).length === 2) {
      socket?.emit("both-users-agreed-next", roomId);
      usersAgreedNext[roomId] = {};
    }
  });

  socket.on("change-question", (nextQuestionId) => {
    io?.emit("set-question", nextQuestionId);
  });

  socket.on("user-agreed-end", (roomId, userId) => {
    usersAgreedEnd[roomId] = usersAgreedEnd[roomId] || {};
    usersAgreedEnd[roomId][userId] = true;

    if (Object.keys(usersAgreedEnd[roomId]).length === 2) {
      io?.emit("both-users-agreed-end", roomId);
      usersAgreedEnd[roomId] = {};
    }
  });

  // Listen for language changes.
  socket.on(
    "language-change",
    (roomId: string, newLanguage: EditorLanguageEnum) => {
      // Update the selected language for the room.
      roomLanguages[roomId] = newLanguage;
      // Broadcast this change to all connected users in this room.
      io.to(roomId).emit("receive-language-change", newLanguage, socket.data.username);
    }
  );

  // Listen for chat messages.
  socket.on("chat-message", (message) => {
    // Broadcast the message to all connected clients.
    io.emit("receive-chat-message", message);
  });

  // Handle user disconnection.
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    io.to(socket.data.roomId).emit("user-disconnect", socket.data.username);
  });
});

startRabbitMQ(io);
