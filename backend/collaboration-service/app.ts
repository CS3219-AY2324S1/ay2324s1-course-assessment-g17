import "dotenv/config";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import * as amqp from "amqplib/callback_api";

const setupWSConnection = require("y-websocket/bin/utils").setupWSConnection;

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

wss.on("connection", (ws, req) => {
  setupWSConnection(ws, req);
  console.log("connection");
});

const rabbitMQUrl = process.env.RABBITMQ_URL || "amqp://localhost";
amqp.connect(rabbitMQUrl, (error0, connection) => {
  if (error0) throw error0;
  connection.createChannel((error1, channel) => {
    if (error1) throw error1;
    const queue = "match_results";

    channel.assertQueue(queue, { durable: false });
    console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);
    channel.consume(
      queue,
      (msg) => {
        if (!msg) return;
        const matchResult = JSON.parse(msg.content.toString());
        console.log(`[x] Received ${JSON.stringify(matchResult)}`);
      },
      { noAck: true },
    );
  });
});
