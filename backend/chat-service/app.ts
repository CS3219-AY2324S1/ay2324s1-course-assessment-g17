// Credits: https://github.com/imgitto/Simple-File-Sharing-App/blob/main/public/code.js
// For providing inspiration for the file sharing functions

import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { Message, MyFile } from "./types/chat/messages";

const FRONTEND_URL = process.env.FRONTEND_URL as string;
const SOCKET_IO_PORT = process.env.SOCKET_IO_PORT as string;

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
  maxHttpBufferSize: 1e7,
});

httpServer.listen(SOCKET_IO_PORT, () => {
  console.log(
    `Socket.io server is listening on http://localhost:${SOCKET_IO_PORT}`,
  );
});

// Handle other collaboration features.
io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  // Listen for room joining.
  socket.on("join-room", (roomId: string) => {
    // Join the user to the specified room.
    socket.join(roomId);
  });

  // Listen for chat messages.
  socket.on("chat-message", (message: Message) => {
    // Broadcast the message to all connected clients.
    io.emit("receive-chat-message", message);
  });

  // Listen for file uploads
  socket.on("upload", (outFile: MyFile) => {
    // Broadcast the file to all connected clients.
    io.emit("file-receive", outFile);
  });

  // Handle user disconnection.
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
