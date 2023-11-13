export enum QuestionComplexityEnum {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

export const QuestionComplexityEnumToLevelMap: Record<QuestionComplexityEnum, number> = Object.freeze({
  [QuestionComplexityEnum.EASY]: 1,
  [QuestionComplexityEnum.MEDIUM]: 2,
  [QuestionComplexityEnum.HARD]: 3,
});

export interface QuestionMiniData {
  questionID: string;
  complexity: string;
  categories: string[];
}

export interface QuestionData {
  id: number;
  questionID: number;
  title: string;
  categories: string[];
  complexity: QuestionComplexityEnum;
  linkToQuestion: string;
  questionDescription: string;
  questionImageURLs?: string[];
}

export interface QuestionPostData {
  title: string;
  categories: string[];
  complexity: string;
  questionDescription: string;
  linkToQuestion: string;
}

export const LINK_PREFIX = 'https://leetcode.com/problems/';
