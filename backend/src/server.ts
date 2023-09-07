import mongoose from "mongoose";
import "dotenv/config";
import app from "./app";

const port = process.env.PORT;
const mongoString = process.env.MONGO_CONNECTION_STRING;
if (!mongoString) {
  throw new Error("MONGO_CONNECTION_STRING must be defined");
}

mongoose
  .connect(mongoString)
  .then(() => {
    console.log("Connected to Mongoose");
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(console.error);
