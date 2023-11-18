import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import questionRoutes from "./routes/questions";
import adminQuestionRoutes from "./routes/adminQuestions";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL as string;

app.use(
  cors({ origin: FRONTEND_URL, optionsSuccessStatus: 200, credentials: true })
);

app.use(morgan("dev"));

app.use(express.json());

// Use cookie-parser middleware before routes and middleware that need to access cookies
app.use(cookieParser());

// Protected API routes and respective protect middleware
app.use("/api/questions", questionRoutes);
app.use("/api/questions", adminQuestionRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, "Not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let message = "Something went wrong";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    message = error.message;
  }
  res.status(statusCode).json({ message });
});

export default app;
