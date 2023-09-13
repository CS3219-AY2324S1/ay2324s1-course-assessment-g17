import { type QuestionData, type QuestionPostData } from '../../types/questions/questions';
import client from '../base';

export default class QuestionsAPI {
  protected getQuestionsUrl(): string {
    return '/questions';
  }

  public async getQuestions(): Promise<QuestionData[]> {
    const response = await client.get(this.getQuestionsUrl());
    const questionList = response.data.data as QuestionData[];
    return questionList;
  }

  public async getCategories(): Promise<string[]> {
    const response = await client.get(`${this.getQuestionsUrl()}/categories`);
    const categories = response.data.data as string[];
    return categories;
  }

  public async addQuestion(question: QuestionPostData): Promise<never> {
    return await client.post(this.getQuestionsUrl(), question);
  }

  public async getQuestionById(questionId: number): Promise<QuestionData | null> {
    try {
      const response = await client.get(`${this.getQuestionsUrl()}/${questionId}`);
      const question = response.data.data as QuestionData;
      return question;
    } catch (error) {
      console.error('Error fetching question by ID:', error);
      return null;
    }
  }
}
