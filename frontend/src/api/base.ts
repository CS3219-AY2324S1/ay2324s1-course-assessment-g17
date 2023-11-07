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
  baseURL: process.env.REACT_APP_COLLABORATION_SERVICE_SOCKET_IO_BACKEND_URL,
  withCredentials: true,
});

export const codeExecutionServiceClient = axios.create({
  baseURL: `https://${process.env.REACT_APP_RAPID_API_HOST}`,
});

export default client;
