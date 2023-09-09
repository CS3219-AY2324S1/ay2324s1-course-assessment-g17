export enum QuestionComplexityEnum {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

export interface QuestionData {
  questionID: number
  title: string
  categories: string[]
  complexity: QuestionComplexityEnum
  linkToQuestion: string
  questionDescription: string
  questionImageURLs?: string[]
};

export interface QuestionPostData {
  title: string
  categories: string[]
  complexity: string
  questionDescription: string
  linkToQuestion: string
};
