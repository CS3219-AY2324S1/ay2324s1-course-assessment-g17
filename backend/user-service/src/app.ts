import express from "express";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
const app = express();

app.use(express.json());

app.use("/api", userRoutes);
app.use("/", authRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
