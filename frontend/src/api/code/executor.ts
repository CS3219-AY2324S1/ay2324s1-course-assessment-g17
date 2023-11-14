import { type ExecutorStatusData, type ExecutorSubmissionPostData } from '../../types/code/executor';
import { codeExecutionServiceClient } from '../base';

export default class ExecutorAPI {
  protected getExecutorUrl(): string {
    return '/api/code-execute';
  }

  public async submitCode(codeSubmission: ExecutorSubmissionPostData): Promise<string> {
    const response = await codeExecutionServiceClient.post(this.getExecutorUrl(), codeSubmission);
    const token = response.data as string;
    return token;
  }

  public async getExecutorSubmissionData(token: string): Promise<ExecutorStatusData> {
    const response = await codeExecutionServiceClient.get(`${this.getExecutorUrl()}/${token}`);
    const submissionStatus = response.data as ExecutorStatusData;
    return submissionStatus;
  }
}
