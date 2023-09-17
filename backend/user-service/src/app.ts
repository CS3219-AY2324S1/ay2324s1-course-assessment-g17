import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import cors from "cors";

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL as string;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({ origin: FRONTEND_URL, optionsSuccessStatus: 200, credentials: true })
);

app.use("/api", userRoutes);
app.use("/", authRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
