import * as QuestionsController from "../controllers/questions";
import express from "express";

const router = express.Router();

// Available to regular users
router.get("/", QuestionsController.getQuestions);

router.get("/categories", QuestionsController.getQuestionCategories);

router.get("/:questionId", QuestionsController.getQuestion);

export default router;
