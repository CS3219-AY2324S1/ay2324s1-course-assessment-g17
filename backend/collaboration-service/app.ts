import "dotenv/config";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { Server } from 'socket.io';
import { startRabbitMQ } from "./consumer";

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
const io = new Server(server); // Create a Socket.IO instance HTTP server.

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

// Handle other collaboration features.
io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  // Handle chat messages.
  socket.on('chat-message', (message) => {
    // Broadcast the message to all connected clients.
    io.emit('chat-message', message);
  });

  // Handle user disconnection.
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

startRabbitMQ();
