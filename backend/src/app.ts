import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import questionRoutes from "./question_service/routes/questions";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use("/api/questions", questionRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  next(error);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let message = "Something went wrong";
  if (error instanceof Error) {
    message = error.message;
    res.status(500).json({ error: message });
  }
});

export default app;
