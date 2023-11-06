FROM node:18

RUN npm install -g nodemon

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --frozen-lockfile

RUN npm install -g typescript ts-node

COPY . .

EXPOSE 9001

CMD ["sh", "-c", "HOST=$HOST PORT=$PORT nodemon --exec ts-node ./app.ts"]
