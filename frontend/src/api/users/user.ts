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
}
