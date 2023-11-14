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

export const collabServiceClient = axios.create({
  baseURL:
    process.env.REACT_APP_COLLABORATION_SERVICE_SOCKET_IO_BACKEND_URL +
    (process.env.REACT_APP_COLLABORATION_API_PATH ?? ''),
  withCredentials: true,
});

export const forumServiceClient = axios.create({
  baseURL: process.env.REACT_APP_FORUM_SERVICE_BACKEND_URL,
  withCredentials: true,
});

export const codeExecutionServiceClient = axios.create({
  baseURL: `https://${process.env.REACT_APP_RAPID_API_HOST}`,
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
        console.log('Refreshed question service, for access token.');
        return await axios.request(error.config);
      } catch (error) {
        throw error;
      }
    }
  }
  return error.response;
});

// // Add a response interceptor
userServiceClient.interceptors.response.use(null, async (error: AxiosError) => {
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (error != null && error.config != null && error.response != null) {
    const requestUrl = error.config.url;
    console.log(`Intercepted request to ${requestUrl}`);

    if (
      error.response.status === 401 &&
      requestUrl !== '/login' &&
      requestUrl !== '/signup' &&
      requestUrl !== '/oauth/auth' &&
      requestUrl !== '/oauth/signup' &&
      requestUrl !== '/token' &&
      requestUrl !== '/logout'
    ) {
      // eslint-disable-next-line no-useless-catch
      try {
        const authApi = new AuthAPI();
        await authApi.useRefreshToken();
        console.log('Refreshed user service, for access token.');
        return await axios.request(error.config);
      } catch (error) {
        throw error;
      }
    }
  }
  throw error;
});

export default client;
