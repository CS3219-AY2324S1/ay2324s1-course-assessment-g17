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
    // TODO: track socket id somewhere
    // TODO: check db for potential match
    // TODO: save timeout somewhere to revoke on match
    setTimeout(() => socket.emit("timeout"), 5000);
  });
  socket.on("disconnect", () => {
    // TODO: drop user from matching
    console.log(`socket ${socket.id} disconnected`);
  });
};

export default registerMatchingHandlers;
