import { InferSchemaType, Schema, model } from "mongoose";

const complexityEnum = ["Easy", "Medium", "Hard"];

const questionSchema = new Schema({
  questionID: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  categories: {
    type: [String],
    required: true,
  },
  complexity: {
    type: String,
    enum: complexityEnum, 
    required: true,
  },
  linkToQuestion: {
    type: String,
    required: true,
  },
  questionDescription: {
    type: String,
    required: true,
  },
  questionImageURL: {
    type: String, 
    required: false, 
  },
});

type Question = InferSchemaType<typeof questionSchema>;

export default model<Question>("Question", questionSchema);
