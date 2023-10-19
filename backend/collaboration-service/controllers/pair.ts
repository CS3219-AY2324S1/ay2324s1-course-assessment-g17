import Pair from "../models/pair";
import { Request, Response } from "express";
import axios from "axios";

interface Question {
  questionID: number;
}

const questionsAPIUrl = process.env.QUESTIONS_API_URL! + "/questions";

export const checkAuthorisedUser = async (req: Request, res: Response) => {
  const userId = req.query.userId;
  const roomId = req.query.roomId;

  try {
    const pairs = await Pair.find({ room_id: roomId });
    const userOneId = pairs[0].userOne;
    const userTwoId = pairs[0].userTwo;
    if (userId === String(userOneId) || userId === String(userTwoId)) {
      res.json({ authorised: true });
    } else {
      res.json({ authorised: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export async function selectNewQuestion(roomId: string) {
  const pairInfo = await Pair.find({ room_id: roomId });
  const categories = pairInfo[0].categories;
  const complexity = pairInfo[0].complexity;
  const completed = pairInfo[0].question_ids;
  const response = await axios.get(questionsAPIUrl, {
    params: {
      categories: categories,
      complexities: complexity,
    },
    headers: {
      Cookie: `serverToken=${process.env.SERVER_SECRET};`,
    },
  });

  const questionIds = response.data.data.map(
    (question: Question) => question.questionID,
  );
  const nextQuestion = questionIds.filter((id: number) => !completed.includes(id))[0];
  return nextQuestion;
}

export async function getCurrentQuestion(roomId: string) {
  const pairInfo = await Pair.find({ room_id: roomId });
  const currentQuestionId = pairInfo[0].question_ids[pairInfo[0].question_ids.length - 1];
  const currQuestion = await axios.get(
    `${questionsAPIUrl}/${currentQuestionId}`,
    {
      headers: {
        Cookie: `serverToken=${process.env.SERVER_SECRET};`,
      },
    },
  );
  return currQuestion;
}
