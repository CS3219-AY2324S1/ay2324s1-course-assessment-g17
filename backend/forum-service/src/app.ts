import express from "express";
import routes from "./routes/routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import * as AuthMiddleWare from "./middleware/authMiddleware";

const app = express();

app.use(express.json());
app.use(cookieParser());

const FRONTEND_URL = process.env.FRONTEND_URL as string;

app.use(
  cors({ origin: FRONTEND_URL, optionsSuccessStatus: 200, credentials: true }),
);

app.use("/", AuthMiddleWare.verifyAccessToken, routes);

const PORT = process.env.PORT || 9001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
