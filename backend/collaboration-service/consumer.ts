import * as amqp from "amqplib/callback_api";
import Pair from "./models/pair";
import axios from "axios";
import { Server } from "socket.io";
import { roomCurrentQuestion } from "./app";

interface Question {
  questionID: number;
}

export function startRabbitMQ(io: Server) {
  const rabbitMQUrl = process.env.RABBITMQ_URL || "amqp://localhost";
  const questionsAPIUrl = process.env.QUESTIONS_API_URL! + "/questions";
  amqp.connect(rabbitMQUrl, (error0, connection) => {
    if (error0) throw error0;
    connection.createChannel((error1, channel) => {
      if (error1) throw error1;
      const queue = "match_results";

      channel.assertQueue(queue, { durable: false });
      console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);
      channel.consume(
        queue,
        async (msg) => {
          if (!msg) return;
          const matchResult = JSON.parse(msg.content.toString());
          console.log(`[x] Received ${JSON.stringify(matchResult)}`);
          const pairInfo = {
            userOne: matchResult.userOne,
            userTwo: matchResult.userTwo,
            room_id: matchResult.roomId,
            complexity: matchResult.difficulty_level,
            categories: matchResult.categories,
            question_ids: [],
          };

          // Query for 2 questions with specified criteria (i.e. ANY of categories/complexities)
          const response = await axios.get(questionsAPIUrl, {
            params: {
              categories: pairInfo.categories,
              complexities: matchResult.difficulty_level,
              limit: 2,
            },
            headers: {
              Cookie: `serverToken=${process.env.SERVER_SECRET};`,
            },
          });

          const questionIds = response.data.data.map(
            (question: Question) => question.questionID,
          );

          // If not enough questions, grab random questions.
          if (questionIds.length < 2) {
            const response = await axios.get(questionsAPIUrl, {
              params: {
                limit: 2 - questionIds.length,
                exclude: questionIds,
              },
              headers: {
                Cookie: `serverToken=${process.env.SERVER_SECRET};`,
              },
            });
            questionIds.push(
              ...response.data.data.map(
                (question: Question) => question.questionID,
              ),
            );
          }

          pairInfo.question_ids = questionIds;

          const newPair = new Pair(pairInfo);

          newPair
            .save()
            .then((pair) => {
              console.log(`Created pair: ${pair}`);
            })
            .catch((error) => {
              console.error(error);
            });

          roomCurrentQuestion[pairInfo.room_id] = pairInfo.question_ids[0];
          io.to(pairInfo.room_id).emit(
            "set-question",
            pairInfo.question_ids[0],
          );
        },
        { noAck: true },
      );
    });
  });
}
