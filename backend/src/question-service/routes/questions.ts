import * as QuestionsController from "../controllers/questions";
import express from "express";

const router = express.Router();

router.get("/", QuestionsController.getQuestions);

router.post("/", QuestionsController.addQuestion);

// TODO: "/:questionId", "/:questionId/update", "/:questionId/delete"

export default router;
