FROM node:18

RUN npm install -g nodemon

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --frozen-lockfile

RUN npm install -g typescript ts-node

COPY . .

ENV RABBITMQ_URL="amqp://localhost:5672"
ENV MONGODB_URL="mongodb+srv://sherylhci:wsY2vQnTjSStiIQ8@cluster0.kxz8d7c.mongodb.net/peerprep_app?retryWrites=true&w=majority"
ENV FRONTEND_URL="http://localhost:3000"
ENV SOCKET_IO_PORT=8082
ENV PORT=8081
ENV SERVER_SECRET="server_secret"
ENV QUESTIONS_API_URL="http://localhost:8080/api"

EXPOSE 8081
EXPOSE 8082

CMD ["sh", "-c", "HOST=$HOST PORT=$PORT npx y-websocket & nodemon --exec ts-node ./app.ts"]
