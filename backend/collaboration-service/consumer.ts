import * as amqp from "amqplib/callback_api";
import { v4 as uuidv4 } from "uuid";
import Pair from "./models/pair";

export function startRabbitMQ() {
  const rabbitMQUrl = process.env.RABBITMQ_URL || "amqp://localhost";

  amqp.connect(rabbitMQUrl, (error0, connection) => {
    if (error0) throw error0;
    connection.createChannel((error1, channel) => {
      if (error1) throw error1;
      const queue = "match_results";

      function generateRoomId() {
        const roomId = uuidv4();
        return roomId;
      }

      channel.assertQueue(queue, { durable: false });
      console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);
      channel.consume(
        queue,
        (msg) => {
          if (!msg) return;
          const matchResult = JSON.parse(msg.content.toString());
          console.log(`[x] Received ${JSON.stringify(matchResult)}`);
          const pairInfo = {
            userOne: matchResult.userOne,
            userTwo: matchResult.userTwo,
            room_id: generateRoomId(),
            complexity: matchResult.difficulty_level,
            categories: matchResult.categories,
            question_ids: [], // to fetch
          };

          const newPair = new Pair(pairInfo);

          newPair
            .save()
            .then((pair) => {
              console.log(`Created pair: ${pair}`);
            })
            .catch((error) => {
              console.error(error);
            });
        },
        { noAck: true },
      );
    });
  });
}
