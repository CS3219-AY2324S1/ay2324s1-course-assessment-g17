import http from "http";
import dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import {
  createMatchingTable,
  insertMatchingInfo,
} from "../model/matchingModel";

export enum QuestionComplexityEnum {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
}

export enum MatchStatusEnum {
  MATCHED = "Matched",
  PENDING = "Pending",
  TIMEOUT = "Timeout",
}
interface RequestMatchProps {
  userId: number;
  complexities: QuestionComplexityEnum[];
  categories: string[];
}

const registerMatchingHandlers = (io: Server, socket: Socket) => {
  socket.on("requestMatch", (props: RequestMatchProps) => {
    createMatchingTable();

    const matchingInfo = {
      user_id: props.userId,
      socket_id: socket.id,
      difficulty_level: props.complexities,
      topics: props.categories,
      status: MatchStatusEnum.PENDING,
    };

    insertMatchingInfo(matchingInfo);

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
