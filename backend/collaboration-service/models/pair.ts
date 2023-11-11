import { Schema, model } from "mongoose";

export enum QuestionComplexityEnum {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
}

export interface Pair {
  userOne: number;
  userTwo: number;
  room_id: string;
  complexity: QuestionComplexityEnum[];
  categories: string[];
  question_ids: number[];
}

const pairSchema = new Schema<Pair>({
  userOne: Number,
  userTwo: Number,
  room_id: String,
  complexity: [String],
  categories: [String],
  question_ids: [Number],
});

export default model<Pair>("Pair", pairSchema);
