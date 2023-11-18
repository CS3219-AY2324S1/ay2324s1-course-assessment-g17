import { type QuestionMiniData } from '../../types/questions/questions';
import type { Language } from '../../types/users/users';
import { userServiceClient } from '../base';

export default class UserAPI {
  protected getUserUrl(): string {
    return '/api/';
  }

  public async getLanguages(): Promise<Language[]> {
    const response = await userServiceClient.get(this.getUserUrl() + 'languages');
    return response.data;
  }

  public async postSaveAnsweredQuestion(userId: number, question: QuestionMiniData): Promise<void> {
    await userServiceClient.post(this.getUserUrl() + 'user/add-answered-question', {
      userId,
      questionId: question.questionID,
      complexity: question.complexity,
      category: question.categories,
    });
  }
}
