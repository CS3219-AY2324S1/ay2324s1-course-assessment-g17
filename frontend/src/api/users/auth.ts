import type { LogInPostData } from '../../types/users/auth';
import type { User } from '../../types/users/users';
import { userServiceClient } from '../base';

export default class AuthAPI {
  protected getAuthUrl(): string {
    return '/';
  }

  public async logIn(data: LogInPostData): Promise<User> {
    const response = await userServiceClient.post(this.getAuthUrl() + 'login', data);
    return response.data.user;
  }
}
