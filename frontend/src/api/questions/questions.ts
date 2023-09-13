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

  public async deleteQuestion(questionId: number): Promise<void> {
    await client.delete(`${this.getQuestionsUrl()}/${questionId}`);
  }

  // get individual question (placeholder function for 'update question')
  public async getQuestion(questionId: string): Promise<QuestionData> {
    const response = await client.get(`${this.getQuestionsUrl()}/${questionId}`);
    const questionData = response.data.data as QuestionData;
    return questionData;
  }

  // update question
  public async updateQuestion(questionId: string, updatedQuestion: Partial<QuestionPostData>): Promise<QuestionData> {
    const response = await client.patch(`${this.getQuestionsUrl()}/${questionId}`, updatedQuestion);
    const updatedQuestionData = response.data.data as QuestionData;
    return updatedQuestionData;
  }
}
