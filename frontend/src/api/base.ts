import axios from 'axios';

const client = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL
});

export default client;