import { createServer } from "http";
import dotenv from "dotenv";
import express from "express";
import { Server, Socket } from "socket.io";
import registerMatchingHandlers from "./socket/matchingHandler";
import cors from "cors";

dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL as string;
const PORT = process.env.PORT as string;

const app = express();
app.use(
  cors({ origin: FRONTEND_URL, optionsSuccessStatus: 200, credentials: true })
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

io.on("connection", onConnection);

httpServer.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
