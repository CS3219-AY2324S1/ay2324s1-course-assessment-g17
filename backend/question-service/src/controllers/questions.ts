import { RequestHandler } from "express";
import QuestionModel, { categoryEnum } from "../models/question";
import {
  body,
  matchedData,
  validationResult,
  param,
  query,
} from "express-validator";
import { complexityEnum } from "../models/question";

export const getQuestions: RequestHandler[] = [
  query("categories")
    .optional()
    .isArray()
    .withMessage("categories should be an array.")
    .custom((categories: string[]) => {
      for (const category of categories) {
        if (!categoryEnum.includes(category)) {
          throw new Error(`Invalid category: ${category}`);
        }
      }
      return true;
    }),
  query("complexities")
    .optional()
    .isArray()
    .isIn(complexityEnum)
    .withMessage(`complexities should be one of ${complexityEnum.join(", ")}.`),
  query("limit").optional().isInt().toInt(),
  async (req, res, next) => {
    if (!validationResult(req).isEmpty()) {
      res.status(400).json({ errors: validationResult(req).array() });
      return;
    }

    try {
      const requestData = matchedData(req, { includeOptionals: true });
      let questionQuery = QuestionModel.find();
      if (requestData.categories) {
        questionQuery = questionQuery.where({
          categories: {
            $elemMatch: { $in: requestData.categories },
          },
        });
      }
      if (requestData.complexities) {
        questionQuery = questionQuery.where({
          complexity: requestData.complexities,
        });
      }
      if (requestData.limit) {
        const count = await questionQuery.clone().count().exec();
        questionQuery = questionQuery
          .skip(
            Math.max(
              0,
              Math.floor(Math.random() * (count - requestData.limit)),
            ),
          )
          .limit(requestData.limit);
      }
      const questions = await questionQuery.exec();
      res.status(200).json({ data: questions });
    } catch (error) {
      next(error);
    }
  },
];

export const getQuestion: RequestHandler[] = [
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

    res.status(200).json({ data: existingQuestion });
  },
];

export const addQuestion: RequestHandler[] = [
  body("title").notEmpty().trim().withMessage("title cannot be empty."),
  body("categories")
    .isArray()
    .withMessage("categories should be an array.")
    .custom((categories: string[]) => {
      for (const category of categories) {
        if (!categoryEnum.includes(category)) {
          throw new Error(`Invalid category: ${category}`);
        }
      }
      return true;
    }),
  body("complexity")
    .isIn(complexityEnum)
    .withMessage(`complexity should be one of ${complexityEnum.join(", ")}.`),
  body("linkToQuestion")
    .isURL()
    .withMessage("linkToQuestion should be a valid URL."),
  body("questionDescription")
    .notEmpty()
    .withMessage("questionDescription should not be empty."),
  async (req, res, next) => {
    if (!validationResult(req).isEmpty()) {
      res.status(400).json({ errors: validationResult(req).array() });
      return;
    }

    const formData = matchedData(req);

    // Check if a question with similar title (case insensitive) is already added.
    const sameQuestionExists = await QuestionModel.exists({
      title: { $regex: new RegExp("^" + formData.title + "$"), $options: "i" },
    });

    if (sameQuestionExists) {
      res.status(400).json({
        errors: [{ msg: "Question already exists in the database." }],
      });
      return;
    }

    const lastQuestion = await QuestionModel.find({})
      .sort({ questionID: -1 })
      .limit(1);
    const questionID = lastQuestion[0] ? lastQuestion[0].questionID + 1 : 1;

    try {
      const question = new QuestionModel({ ...formData, questionID });
      await question.save();

      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
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

export const getQuestionCategories: RequestHandler = (req, res) => {
  res.json({ data: categoryEnum });
};

export const updateQuestion: RequestHandler[] = [
  param("questionId")
    .notEmpty()
    .withMessage("questionId field cannot be empty.")
    .toInt(),
  param("questionId").isNumeric().withMessage("questionId should be a number."),
  body("title").notEmpty().trim().withMessage("title cannot be empty."),
  body("categories").isArray().withMessage("categories should be an array."),
  body("categories")
    .isIn(categoryEnum)
    .withMessage(`categories should be one of ${categoryEnum.join(", ")}.`),
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
    // validation errors for both above
    if (!validationResult(req).isEmpty()) {
      res.status(400).json({ errors: validationResult(req).array() });
      return;
    }

    // Find question
    const questionId = req.params.questionId;
    const existingQuestion = await QuestionModel.findOne({
      questionID: questionId,
    });
    // catch error if no existing question
    if (!existingQuestion) {
      res.status(400).json({ errors: [{ msg: "Question does not exist." }] });
      return;
    }

    const formData = matchedData(req);

    const sameQuestionExists = await QuestionModel.exists({
      title: formData.title,
      questionID: { $ne: questionId },
    });

    if (sameQuestionExists) {
      res.status(400).json({
        errors: [{ msg: "Duplicate question already exists in the database." }],
      });
      return;
    }

    // Update the existing question with the new data
    const finalQuestion = await QuestionModel.findByIdAndUpdate(
      existingQuestion._id,
      formData,
      { new: true },
    );

    res.status(200).json({ data: finalQuestion, status: "success" });
  },
];
