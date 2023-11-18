import { type MatchedPairIdsResponse } from '../../types/collaboration/collaboration';
import { type QuestionMiniData } from '../../types/questions/questions';
import { collabServiceClient } from '../base';

export default class CollaborationAPI {
  private readonly MATCH_FIRST_QUESTION_URL = 'get-first-question';
  private readonly MATCH_SECOND_QUESTION_URL = 'get-second-question';

  protected getCollabUrl(): string {
    return '/api/';
  }

  public async getMatchedQuestion(questionIndex: 1 | 2, roomId: string): Promise<QuestionMiniData> {
    const queryUrl = questionIndex === 1 ? this.MATCH_FIRST_QUESTION_URL : this.MATCH_SECOND_QUESTION_URL;
    const response = await collabServiceClient.get(this.getCollabUrl() + queryUrl, { params: { roomId } });
    return response.data.data;
  }

  public async getMatchedPairInfo(roomId: string): Promise<MatchedPairIdsResponse> {
    const response = await collabServiceClient.get(this.getCollabUrl() + 'get-pair-ids', { params: { roomId } });
    return response.data;
  }

  public async checkAuthorisation(userId: number, roomId: string): Promise<boolean> {
    const response = await collabServiceClient.get(this.getCollabUrl() + 'check-authorization', {
      params: { userId, roomId },
    });
    return response.data.authorised;
  }

  public async getMatchedSecondQuestion(roomId: string): Promise<QuestionMiniData> {
    const response = await collabServiceClient.get(this.getCollabUrl() + this.MATCH_SECOND_QUESTION_URL, {
      params: { roomId },
    });
    return response.data.data;
  }
}
