import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.placeholder.com',
});

export const endpoints = {
  fetchData: (params: any) => api.get('/data', { params }),
  login: (credentials: any) => api.post('/login', credentials),
  register: (userData: any) => api.post('/register', userData),
};

export default api;