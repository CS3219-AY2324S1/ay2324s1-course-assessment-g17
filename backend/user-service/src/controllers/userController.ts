import prisma from "../lib/prisma";
import { Request, Response } from "express";

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("error fetching users:", error);
    res.status(500).json({ error: "error fetching users" });
  }
}

export async function getLanguages(req: Request, res: Response) {
  try {
    const languages = await prisma.language.findMany();
    res.json(languages);
  } catch (error) {
    console.error("error fetching languages:", error);
    res.status(500).json({ error: "error fetching languages" });
  }
}

export async function getUserQuestions(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    const answeredQuestions = await prisma.answeredQuestion.findMany({
      where: {
        userId: parseInt(userId),
      },
    });

    res.json(answeredQuestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function addUserQuestion(req: Request, res: Response) {
  try {
    const { userId, questionId, complexity, category } = req.body;

    const createdQuestion = await prisma.answeredQuestion.create({
      data: {
        userId: userId,
        questionId: questionId,
        complexity: complexity,
        category: { set: category },
      },
    });

    res.json(createdQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
