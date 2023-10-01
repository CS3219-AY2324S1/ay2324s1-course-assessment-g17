import { createServer } from "http";
import dotenv from "dotenv";
import express from "express";
import { Server, Socket } from "socket.io";
import registerMatchingHandlers from "./socket/matchingHandler";
import cors from "cors";
import mongoose from "mongoose";

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

io.on("connection", onConnection);

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
