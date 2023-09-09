import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import questionRoutes from "./question-service/routes/questions";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import cors from "cors";

const app = express();

app.use(cors())

app.use(morgan("dev"));

app.use(express.json());

app.use("/api/questions", questionRoutes);

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
