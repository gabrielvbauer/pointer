import axios from 'axios';

export const mirageAPI = axios.create({
  baseURL: 'http://localhost:3333',
});
