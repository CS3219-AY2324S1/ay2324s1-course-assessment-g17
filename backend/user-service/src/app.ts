import express from "express";
import userRoutes from "./routes/userRoutes";
const app = express();

app.use('/api', userRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
