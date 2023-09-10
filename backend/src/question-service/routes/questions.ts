import * as QuestionsController from "../controllers/questions";
import express from "express";

const router = express.Router();

router.get("/", QuestionsController.getQuestions);

router.post("/", QuestionsController.addQuestion);

router.delete("/:questionId", QuestionsController.deleteQuestion);

router.get("/categories", QuestionsController.getQuestionCategories);

router.get("/:questionId", QuestionsController.getQuestion);

router.put("/:questionId/update", QuestionsController.updateQuestion);

export default router;
