import axios from 'axios';
import type { AxiosError } from 'axios';
import AuthAPI from './users/auth';

const client = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true,
});

export const userServiceClient = axios.create({
  baseURL: process.env.REACT_APP_USER_SERVICE_BACKEND_URL,
  withCredentials: true,
});

// Add a response interceptor
client.interceptors.response.use(null, async (error: AxiosError) => {
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (error != null && error.config != null && error.response != null) {
    if (error.response.status === 401) {
      // eslint-disable-next-line no-useless-catch
      try {
        const authApi = new AuthAPI();
        await authApi.useRefreshToken();
        console.log('Refreshed1');
        return await axios.request(error.config);
      } catch (error) {
        throw error;
      }
    }
  }
  return error.response;
});

export default client;
