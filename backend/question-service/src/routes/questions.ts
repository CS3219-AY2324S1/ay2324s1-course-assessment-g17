import * as QuestionsController from "../controllers/questions";
import * as AuthMiddleWare from "../middleware/authMiddleware";
import express from "express";

const router = express.Router();

// Apply protect middleware to protect all routes below
router.use(AuthMiddleWare.protect);

// Available to regular users
router.get("/", QuestionsController.getQuestions);

router.get("/categories", QuestionsController.getQuestionCategories);

router.get("/:questionId", QuestionsController.getQuestion);

// Restricted to admin users
router.post("/", QuestionsController.addQuestion);

router.delete("/:questionId", QuestionsController.deleteQuestion);

router.patch("/:questionId", QuestionsController.updateQuestion);

export default router;
