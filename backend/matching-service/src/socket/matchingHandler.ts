import http from "http";
import dotenv from "dotenv";
import { Server, Socket } from "socket.io";

export enum QuestionComplexityEnum {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
}

interface RequestMatchProps {
  complexity: QuestionComplexityEnum;
  categories: string[];
}

const registerMatchingHandlers = (io: Server, socket: Socket) => {
  socket.on("requestMatch", (props: RequestMatchProps) => {
    console.log(props);
  });
};

export default registerMatchingHandlers;
