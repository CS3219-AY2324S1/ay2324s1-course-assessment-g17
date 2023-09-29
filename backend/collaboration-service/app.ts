import "dotenv/config";
import { createServer } from "http";
import { WebSocketServer } from "ws";

const setupWSConnection = require('y-websocket/bin/utils').setupWSConnection;

const server = createServer((_request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('Binded');
});

const wss = new WebSocketServer({ server: server });

function onError(error: any) {
  console.log('error', error);
}

function onListening() {
  console.log("Listening");
}

server.on('error', onError);
server.on('listening', onListening);

wss.on('connection', (ws, req) => {
  setupWSConnection(ws, req);
  console.log('connection');
});
