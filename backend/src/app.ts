import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import QuestionModel from "./models/question";

const app = express();

app.get("/", async (req, res, next) => {
  try {
    const questions = await QuestionModel.find().exec();
    res.status(200).json(questions);
  } catch (error) {
    next(error);
  }
});

app.use((req, res, next) => {
  const error = new Error("Not found");
  next(error);
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let message = "Something went wrong";
  if (error instanceof Error) {
    message = error.message;
    res.status(500).json({ error: message });
  }
})

export default app;

