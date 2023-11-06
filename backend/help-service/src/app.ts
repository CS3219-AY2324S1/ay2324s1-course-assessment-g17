import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import { TextServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";
import { param } from "express-validator";
import axios from "axios";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const API_KEY = process.env.API_KEY;

const MODEL_NAME = "models/text-bison-001";

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY!),
});

app.get(
  "/:questionId",
  param("questionId").isNumeric().withMessage("questionId should be a number."),
  async (req: Request, res: Response) => {
    const questionsAPIUrl = process.env.QUESTIONS_API_URL! + "/questions";
    const questionId = req.params.questionId;
    const question = await axios.get(`${questionsAPIUrl}/${questionId}`, {
      headers: {
        Cookie: `serverToken=${process.env.SERVER_SECRET};`,
      },
    });
    const description = question.data.data.questionDescription;
    const promptPrefix =
      "You are a assistant in a coding interview. Give a helpful hint that helps solve this problem. Do not return code. Do not give the entire solution.";
    const promptString = promptPrefix + description;
    client
      .generateText({
        // required, which model to use to generate the result
        model: MODEL_NAME,
        // optional, 0.0 always uses the highest-probability result
        temperature: 0.7,
        // optional, how many candidate results to generate
        candidateCount: 1,
        // optional, number of most probable tokens to consider for generation
        topK: 40,
        // optional, for nucleus sampling decoding strategy
        topP: 0.95,
        // optional, maximum number of output tokens to generate
        maxOutputTokens: 1024,
        // optional, safety settings
        safetySettings: [
          { category: "HARM_CATEGORY_DEROGATORY", threshold: 1 },
          { category: "HARM_CATEGORY_TOXICITY", threshold: 1 },
          { category: "HARM_CATEGORY_VIOLENCE", threshold: 2 },
          { category: "HARM_CATEGORY_SEXUAL", threshold: 2 },
          { category: "HARM_CATEGORY_MEDICAL", threshold: 2 },
          { category: "HARM_CATEGORY_DANGEROUS", threshold: 2 },
        ],
        prompt: {
          text: promptString,
        },
      })
      .then((result) => {
        const output = result[0]["candidates"]![0]["output"];
        res.send(output);
      });
  }
);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
