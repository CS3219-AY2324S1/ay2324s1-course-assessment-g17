import http from "http";
import dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import {
  findMatch,
  insertMatching,
  markAsTimeout,
} from "../controllers/matchingController";
import { store } from "../utils/store";
import matching from "../models/matching";
import * as amqp from "amqplib/callback_api";
import { v4 as uuidv4 } from "uuid";

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
  socket.on("requestMatch", async (props: RequestMatchProps) => {
    const matchingInfo = {
      user_id: props.userId,
      socket_id: socket.id,
      difficulty_level: props.complexities,
      topics: props.categories,
      status: MatchStatusEnum.PENDING,
    };

    const result = await findMatch(matchingInfo);
    if (!result) {
      // If no match found, insert pending match to DB and start timeout.
      insertMatching(matchingInfo);
      store[matchingInfo.user_id] = setTimeout(() => {
        // TODO: update match status
        markAsTimeout(matchingInfo);
        socket.emit("timeout");
      }, 30000);
    } else {
      // If match found:
      // 1. Insert matched match to DB
      // 2. Clear first request's timeout
      // 3. Add match to RabbitMQ
      // 4. Notify both users.
      insertMatching({ ...matchingInfo, status: MatchStatusEnum.MATCHED });
      const roomId = uuidv4();
      const matchResult = {
        userOne: matchingInfo.user_id,
        userTwo: result.user_id,
        categories: result.categories,
        difficulty_level: result.difficulty_levels,
        roomId: roomId,
      };
      clearTimeout(store[matchResult.userTwo]);

      console.log("Found a match!");
      console.log(matchResult);

      const rabbitMQUrl = process.env.RABBITMQ_URL || "amqp://localhost";
      amqp.connect(rabbitMQUrl, (error0, connection) => {
        if (error0) throw error0;
        connection.createChannel((error1, channel) => {
          if (error1) throw error1;
          const queue = "match_results";

          channel.assertQueue(queue, { durable: false });
          channel.sendToQueue(queue, Buffer.from(JSON.stringify(matchResult)));
          console.log(`[x] Sent ${JSON.stringify(matchResult)}`);
        });
        setTimeout(() => {
          connection.close();
        }, 500);
      });

      // Notify both users of the match result.
      socket.emit("matchFound", { roomId });
      socket.to(result.socket_id).emit("matchFound", { roomId });
    }
  });
  socket.on("disconnect", () => {
    // TODO: drop user from matching
    console.log(`socket ${socket.id} disconnected`);
  });
};

export default registerMatchingHandlers;
