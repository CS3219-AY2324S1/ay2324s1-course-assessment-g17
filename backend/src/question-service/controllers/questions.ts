import { RequestHandler } from "express";
import QuestionModel, { categoryEnum } from "../models/question";
import { body, matchedData, validationResult, param } from "express-validator";
import { complexityEnum } from "../models/question";

export const getQuestions: RequestHandler = async (req, res, next) => {
  try {
    const questions = await QuestionModel.find().exec();
    res.status(200).json(questions);
  } catch (error) {
    next(error);
  }
};

export const addQuestion: RequestHandler[] = [
  body("title").notEmpty().withMessage("title cannot be empty."),
  body("categories").isArray().withMessage("categories should be an array."),
  body("complexity")
    .isIn(complexityEnum)
    .withMessage(`complexity should be one of ${complexityEnum.join(", ")}.`),
  body("linkToQuestion")
    .isURL()
    .withMessage("linkToQuestion should be a valid URL."),
  body("questionDescription")
    .notEmpty()
    .withMessage("questionDescription should not be empty."),
  async (req, res) => {
    if (!validationResult(req).isEmpty()) {
      res.status(400).json({ errors: validationResult(req).array() });
      return;
    }

    const formData = matchedData(req);
    const lastQuestion = await QuestionModel.find({})
      .sort({ questionID: -1 })
      .limit(1);
    const questionID = lastQuestion[0] ? lastQuestion[0].questionID + 1 : 1;
    const question = new QuestionModel({ ...formData, questionID });
    await question.save();

    res.sendStatus(200);
  },
];

export const deleteQuestion: RequestHandler[] = [
  param("questionId").notEmpty().withMessage("question field cannot be empty."),
  param("questionId").isNumeric().withMessage("questionId should be a number."),
  async (req, res) => {
    if (!validationResult(req).isEmpty()) {
      res.status(400).json({ errors: validationResult(req).array() });
      return;
    }
    const questionId = req.params.questionId;
    const existingQuestion = await QuestionModel.findOne({
      questionID: questionId,
    });

    if (!existingQuestion) {
      res.status(400).json({ errors: [{ msg: "question does not exist." }] });
      return;
    }

    await existingQuestion.deleteOne();

    res.sendStatus(200);
  },
];
// TODO: updateQuestion
export const getQuestionCategories: RequestHandler = (req, res) => {
  res.json({ data: categoryEnum });
};

// TODO: updateQuestion, deleteQuestion
