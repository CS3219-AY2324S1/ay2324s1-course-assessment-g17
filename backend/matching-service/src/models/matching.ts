import { InferSchemaType, Schema, model } from "mongoose";
export enum QuestionComplexityEnum {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
}

export enum MatchStatusEnum {
  MATCHED = "Matched",
  PENDING = "Pending",
  TIMEOUT = "Timeout",
}

export interface Matching {
  user_id: number;
  socket_id: string;
  difficulty_levels: QuestionComplexityEnum[];
  categories: string[];
  status: MatchStatusEnum;
}

const matchingSchema = new Schema({
  user_id: Number,
  socket_id: String,
  difficulty_levels: [],
  categories: [],
  status: String,
});

export default model<Matching>("Matching", matchingSchema);
