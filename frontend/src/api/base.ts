import axios from 'axios';
import AuthAPI from "./users/auth"

const client = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true,
});

export const userServiceClient = axios.create({
  baseURL: process.env.REACT_APP_USER_SERVICE_BACKEND_URL,
  withCredentials: true,
});

// Add a response interceptor
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const authApi = new AuthAPI();
        await authApi.useRefreshToken()    
        return axios(originalRequest);
      } catch (error) {
        console.log(error)
      }
    }
    return Promise.reject(error);
  }
);

// Add a response interceptor
userServiceClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const authApi = new AuthAPI();
        await authApi.useRefreshToken()    
        return axios(originalRequest);
      } catch (error) {
        console.log(error)
      }
    }
    return Promise.reject(error);
  }
);

export default client;
