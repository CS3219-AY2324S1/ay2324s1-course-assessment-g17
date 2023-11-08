import type { LogInPostData, SignUpPostData } from '../../types/users/auth';
import type { User, UserProfileUpdateData } from '../../types/users/users';
import { type oAuthLoginResponse } from '../../pages/auth/GithubOAuth';
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

  public async authenticateOAuth(code: string): Promise<oAuthLoginResponse> {
    return await userServiceClient.post(this.getAuthUrl() + 'oauth/auth', { code });
  }

  public async createNewOAuthUser(githubId: number, username: string, email: string): Promise<User> {
    return await userServiceClient.post(this.getAuthUrl() + 'oauth/signup', { githubId, username, email });
  }

  public async deregister(): Promise<never> {
    return await userServiceClient.get(this.getAuthUrl() + 'deregister');
  }

  public async getCurrentUser(): Promise<User> {
    const response = await userServiceClient.get(this.getAuthUrl() + 'currentUser');
    return response.data.user;
  }

  public async useRefreshToken(): Promise<never> {
    return await userServiceClient.get(this.getAuthUrl() + 'token');
  }

  // Update user profile data
  public async updateUserProfile(data: UserProfileUpdateData): Promise<User> {
    const response = await userServiceClient.put(this.getAuthUrl() + 'update-profile', data);
    return response.data.user;
  }
}
