FROM node:18

RUN npm install -g nodemon

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

ENV PORT=8000

EXPOSE 8000

CMD ["npm", "start"]

