import type { LogInPostData, SignUpPostData } from '../../types/users/auth';
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

  public async logOut(): Promise<void> {
    await userServiceClient.get(this.getAuthUrl() + 'logout');
  }

  public async signUp(data: SignUpPostData): Promise<never> {
    return await userServiceClient.post(this.getAuthUrl() + 'signup', data);
  }

  public async deregister(): Promise<never> {
    return await userServiceClient.get(this.getAuthUrl() + 'deregister');
  }

  public async getCurrentUser(): Promise<User> {
    const response = await userServiceClient.get(this.getAuthUrl() + 'currentUser');
    return response.data.user;
  }
}
