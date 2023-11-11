import { type ExecutorStatusData, type ExecutorSubmissionPostData } from '../../types/code/executor';
import { codeExecutionServiceClient } from '../base';

export default class ExecutorAPI {
  protected getExecutorUrl(): string {
    return '/submissions';
  }

  public async submitCode(codeSubmission: ExecutorSubmissionPostData): Promise<string> {
    const response = await codeExecutionServiceClient.post(this.getExecutorUrl(), codeSubmission, {
      params: { base64_encoded: 'true', fields: '*' },
      headers: {
        'content-type': 'application/json',
        'Content-Type': 'application/json',
        'X-RapidAPI-Host': process.env.REACT_APP_RAPID_API_HOST,
        'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
      },
    });
    const token = response.data.token as string;
    return token;
  }

  public async getExecutorSubmissionData(token: string): Promise<ExecutorStatusData> {
    const response = await codeExecutionServiceClient.get(`${this.getExecutorUrl()}/${token}`, {
      params: { base64_encoded: 'true', fields: '*' },
      headers: {
        'X-RapidAPI-Host': process.env.REACT_APP_RAPID_API_HOST,
        'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
      },
    });
    const submissionStatus = response.data as ExecutorStatusData;
    return submissionStatus;
  }
}
