import * as QuestionsController from "../controllers/questions";
import express from "express";

const router = express.Router();

router.get("/", QuestionsController.getQuestions);

router.post("/", QuestionsController.addQuestion);

router.delete("/:questionId", QuestionsController.deleteQuestion);

// TODO: "/:questionId", "/:questionId/update"

export default router;
