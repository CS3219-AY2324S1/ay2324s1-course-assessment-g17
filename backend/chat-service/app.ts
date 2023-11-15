// Credits: https://github.com/imgitto/Simple-File-Sharing-App/blob/main/public/code.js
// For providing inspiration for the file sharing functions

import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { Message, MyFile } from "./types/messages";
import { authenticateAccessToken } from "./utils/jwt";

const FRONTEND_URL = process.env.FRONTEND_URL as string;
const SOCKET_IO_PORT =
  (process.env.SOCKET_IO_PORT as string) || (process.env.PORT as string);

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
io.on("connection", async (socket: Socket) => {
  console.log("New connection:", socket.id);

  // START
  function getCookie(cName: string) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(
      socket.handshake.headers.cookie as string,
    );
    console.log("Headers: " + socket.handshake.headers.cookie);
    const cArr = cDecoded.split("; ");
    let res;
    cArr.forEach((val) => {
      if (val.indexOf(name) === 0) res = val.substring(name.length);
    });
    return res;
  }

  const accessToken = getCookie("accessToken"); // if your token is called jwt.
  console.log("Access Token: " + getCookie("accessToken"));

  if (accessToken) {
    try {
      await authenticateAccessToken(accessToken);

      // Middleware ends here
      // Listen for room joining.
      socket.on("join-room", async (roomId: string, username?: string) => {
        // Join the user to the specified room.
        socket.join(roomId);
        // Attach user's username and roomId to this connection
        socket.data.username = username;
        socket.data.roomId = roomId;
        // Broadcast to all connected users that this user has joined the room
        io.to(roomId).emit("joined-room", username);
      });
    } catch (error) {
      console.log(error);
      console.log("Not authorized, access token failed");
      // next(new Error("Not authorized, access token failed"));
      socket.emit("error", { errorMsg: "Not authorized, access token failed" });
      socket.disconnect();
    }
  } else {
    console.log("Not authorized, no access token");
    // next(new Error("Not authorized, no access token"));
    socket.emit("error", { errorMsg: "Not authorized, no access token" });
    socket.disconnect();
  }

  // Listen for chat messages.
  socket.on("chat-message", (roomId: string, message: Message) => {
    // Broadcast the message to all connected clients.
    io.to(roomId).emit("receive-chat-message", message);
  });

  // Listen for file uploads
  socket.on("upload", (roomId: string, outFile: MyFile) => {
    // Broadcast the file to all connected clients.
    io.to(roomId).emit("file-receive", outFile);
  });

  // Handle user disconnection.
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    io.to(socket.data.roomId).emit("user-disconnect", socket.data.username);
  });
});
