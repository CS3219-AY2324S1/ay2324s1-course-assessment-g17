import axios from 'axios';

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
  baseURL: process.env.REACT_APP_COLLABORATION_SERVICE_SOCKET_IO_BACKEND_URL,
  withCredentials: true,
});

export default client;
