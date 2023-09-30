import * as QuestionsController from "../controllers/questions";
import express from "express";

const router = express.Router();

// Restricted to admin users
router.post("/", QuestionsController.addQuestion);

router.delete("/:questionId", QuestionsController.deleteQuestion);

router.patch("/:questionId", QuestionsController.updateQuestion);

export default router;
