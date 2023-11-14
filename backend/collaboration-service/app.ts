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
import { EditorLanguageEnum } from "./types/languages";
import pair from "./models/pair";
import { authenticateAccessToken } from "./utils/jwt";

const FRONTEND_URL = process.env.FRONTEND_URL as string;
const app = express();
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

const SOCKET_IO_PORT =
  (process.env.SOCKET_IO_PORT as string) || (process.env.PORT as string);

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
wss.on("connection", async (ws, req) => {
  setupWSConnection(ws, req);
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
io.on("connection", async (socket) => {
  console.log("New connection:", socket.id);

  // Middleware is integrated below in this block
  function getCookie(cName: string) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(
      socket.handshake.headers.cookie as string,
    );
    // console.log(socket.handshake.headers.cookie);
    const cArr = cDecoded.split("; ");
    let res;
    cArr.forEach((val) => {
      if (val.indexOf(name) === 0) res = val.substring(name.length);
    });
    return res;
  }

  const accessToken = getCookie("accessToken"); // if your token is called jwt.
  // console.log(getCookie("accessToken"))

  if (accessToken) {
    try {
      await authenticateAccessToken(accessToken);

      // Listen for room joining.
      socket.on("join-room", async (roomId: string, username?: string) => {
        // Join the user to the specified room.
        socket.join(roomId);
        // Provide the client with the previously selected language for that room.
        const initialLanguage =
          roomLanguages[roomId] || EditorLanguageEnum.javascript;
        // Send the initial language to this user.
        socket.emit("initial-language", initialLanguage);
        const initialQuestionId = roomCurrentQuestion[roomId];
        if (initialQuestionId) socket.emit("set-first-question", initialQuestionId);
        // Attach user's username and roomId to this connection
        socket.data.username = username;
        socket.data.roomId = roomId;
        // Broadcast to all connected users that this user has joined the room
        io.to(roomId).emit("user-join", username);
      });
  
    } catch (error) {
      console.log(error);
      console.log("Not authorized, access token failed");
      // next(new Error("Not authorized, access token failed"));
      socket.emit("error", { errorMsg: "Not authorized, access token failed" });
      socket.disconnect()
    }
  } else {
    console.log("Not authorized, no access token");
    // next(new Error("Not authorized, no access token"));
    socket.emit("error", { errorMsg: "Not authorized, no access token" });
    socket.disconnect()
  }

  socket.on("user-agreed-next", async (roomId, userId) => {
    usersAgreedNext[roomId] = usersAgreedNext[roomId] || {};
    usersAgreedNext[roomId][userId] = true;
    if (Object.keys(usersAgreedNext[roomId]).length === 2) {
      io.to(roomId).emit("both-users-agreed-next", roomId);
      usersAgreedNext[roomId] = {};

      // set current question to second question
      const pairs = await pair.find({ room_id: roomId });
      const pairInfo = pairs[0];
      const secondQuestionId = pairInfo.question_ids[1];
      roomCurrentQuestion[roomId] = secondQuestionId;
    } else {
      io.to(roomId).emit("waiting-for-other-user", roomId);
    }
  });

  socket.on("change-question", (nextQuestionId, roomId, username: string) => {
    io.to(roomId).emit("set-question", nextQuestionId, username);
  });

  socket.on("user-agreed-end", (roomId, userId) => {
    usersAgreedEnd[roomId] = usersAgreedEnd[roomId] || {};
    usersAgreedEnd[roomId][userId] = true;

    if (Object.keys(usersAgreedEnd[roomId]).length === 2) {
      io.to(roomId).emit("both-users-agreed-end", roomId);
      usersAgreedEnd[roomId] = {};
    } else {
      io.to(roomId).emit("waiting-for-other-user-end", roomId);
    }
  });

  // Listen for language changes.
  socket.on(
    "language-change",
    (roomId: string, newLanguage: EditorLanguageEnum) => {
      // Update the selected language for the room.
      roomLanguages[roomId] = newLanguage;
      // Broadcast this change to all connected users in this room.
      io.to(roomId).emit(
        "receive-language-change",
        newLanguage,
        socket.data.username,
      );
    },
  );

  // Handle user disconnection.
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    io.to(socket.data.roomId).emit("user-disconnect", socket.data.username);
  });
});

startRabbitMQ(io);
