import "dotenv/config";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { startRabbitMQ } from "./consumer";
import express from "express";
import { checkAuthorisedUser } from "./controllers/pair";

const setupWSConnection = require("y-websocket/bin/utils").setupWSConnection;
const cors = require("cors");

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const server = createServer((_request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Binded");
});

const app = express();
app.listen(process.env.PORT || 8081, () => {
  console.log(`Express server is running on port ${process.env.PORT || 8081}`);
});

app.get("/api/check-authorization", checkAuthorisedUser);
const wss = new WebSocketServer({ server: server });

function onError(error: any) {
  console.log("error", error);
}

function onListening() {
  console.log("Listening");
}

server.on("error", onError);
server.on("listening", onListening);

wss.on("connection", (ws, req) => {
  setupWSConnection(ws, req);
  console.log("connection");
});

startRabbitMQ();

app.use(cors());
export default app;
