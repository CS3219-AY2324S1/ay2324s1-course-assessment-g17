import { createServer } from "http";
import dotenv from "dotenv";
import express from "express";
import { Server, Socket } from "socket.io";
import registerMatchingHandlers from "./socket/matchingHandler";
import cors from "cors";
import mongoose from "mongoose";
import matching from "./models/matching";
import { authenticateAccessToken } from "./utils/jwt";
import socketioJwt from "socketio-jwt";

dotenv.config();
const mongoString = process.env.MONGO_CONNECTION_STRING as string;
const FRONTEND_URL = process.env.FRONTEND_URL as string;
const PORT = process.env.PORT as string;

const app = express();
app.use(
  cors({ origin: FRONTEND_URL, optionsSuccessStatus: 200, credentials: true }),
);

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL,
  },
});

const onConnection = (socket: Socket) => {
  registerMatchingHandlers(io, socket);
};

// Middleware
io.on("connection", async (socket: Socket) => {
  function getCookie(cName: string) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(
      socket.handshake.headers.cookie as string,
    );
    console.log(socket.handshake.headers.cookie);
    const cArr = cDecoded.split("; ");
    let res;
    cArr.forEach((val) => {
      if (val.indexOf(name) === 0) res = val.substring(name.length);
    });
    return res;
  }

  const accessToken = getCookie("accessToken"); // if your token is called jwt.
  console.log(getCookie("accessToken"));

  if (accessToken) {
    try {
      await authenticateAccessToken(accessToken);
      onConnection(socket);
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
});

if (!mongoString) {
  throw new Error("MONGO_CONNECTION_STRING must be defined");
}

mongoose
  .connect(mongoString)
  .then(() => {
    console.log("Connected to Mongoose");
    httpServer.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(console.error);
