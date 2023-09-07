import * as QuestionsController from "../controllers/questions";
import express from "express";

const router = express.Router();

router.get("/", QuestionsController.getQuestions);

// TODO: "/:questionId", "/add", "/:questionId/update", "/:questionId/delete"

export default router;
