import mongoose from "mongoose";
import "dotenv/config";
import question from "../models/question";
import fs from "fs/promises";
import path from "node:path";

const mongoString = process.env.MONGO_CONNECTION_STRING;
if (!mongoString) {
  throw new Error("MONGO_CONNECTION_STRING must be defined");
}

mongoose
  .connect(mongoString)
  .then(() => {
    console.log("Connected to Mongoose");
    fs.readFile(path.resolve(__dirname, "questions.json"), {
      encoding: "utf-8",
    })
      .then((data) => JSON.parse(data))
      .then((data) =>
        question.deleteMany().then(() => question.insertMany(data))
      )
      .then(() => {
        mongoose.connection.close();
        console.log(
          "Seed data successfully inserted, closed mongo connection."
        );
      });
  })
  .catch(console.error);
