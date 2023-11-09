FROM node:18

RUN npm install -g nodemon

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --frozen-lockfile

RUN npm install -g typescript ts-node

COPY . .
ENV PORT=9001

EXPOSE 9001

CMD ["npm", "start"]
