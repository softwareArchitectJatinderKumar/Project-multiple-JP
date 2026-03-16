import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const apiService = {
  // Define all signatures here for reusability
  getDashboardData: () => api.get('/dashboard'),
  userLogin: (data: any) => api.post('/auth/login', data),
  userRegister: (data: any) => api.post('/auth/register', data),
  getProducts: () => api.get('/products'),
};