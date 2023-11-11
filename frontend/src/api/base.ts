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

// Add a response interceptor
// userServiceClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // If the error status is 401 and there is no originalRequest._retry flag,
//     // it means the token has expired and we need to refresh it
//     if ((error.response.status as number) === 401 && !(originalRequest._retry as boolean)) {
//       originalRequest._retry = true;
//       const authApi = new AuthAPI();
//       // const navigate = useNavigate();

//       try {
//         await authApi.useRefreshToken();
//         console.log('Refreshed2');
//         return axios(originalRequest);
//       } catch (error) {
//         console.log('Error2');
//         // await authApi.logOut();
//         // navigate('/');
//       }
//     }
//     return error.response;
//   },
// );

export default client;
