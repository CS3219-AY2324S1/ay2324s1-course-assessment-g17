import { RequestHandler } from "express";
import QuestionModel from "../models/question";

export const getQuestions: RequestHandler = async (req, res, next) => {
  try {
    const questions = await QuestionModel.find().exec();
    res.status(200).json(questions);
  } catch (error) {
    next(error);
  }
};

// TODO: addQuestion, updateQuestion, deleteQuestion
