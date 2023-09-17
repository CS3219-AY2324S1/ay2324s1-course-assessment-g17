FROM node:18

RUN npm install -g nodemon

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --frozen-lockfile

COPY . .

ENV MONGO=${MONGO_CONNECTION_STRING}
ENV PORT=8080

EXPOSE 8080

CMD ["npm", "start"]

