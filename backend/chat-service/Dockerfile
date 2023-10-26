FROM node:18

RUN npm install -g nodemon

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --frozen-lockfile

RUN npm install -g typescript ts-node

COPY . .

ENV FRONTEND_URL="http://localhost:3000"
ENV SOCKET_IO_PORT=8084

EXPOSE 8084

CMD ["sh", "-c", "HOST=$HOST PORT=$PORT nodemon --exec ts-node ./app.ts"]