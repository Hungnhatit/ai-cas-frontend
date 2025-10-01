import { api } from '@/lib/axios';
import axios from 'axios';
export const authService = {
  login: async (email: string, password: string) => {
    const res = await api.post(`/auth/login`, { email, password });
    console.log(res);
    return res.data;
  },

  logout: async () => {
    const res = await axios.post(`${process.env.API_URL}/logout`);
    return res.data;
  },

  register: async (data: any) => {
    const res = await api.post('/auth/sign-up', data);
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get(`/auth/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.data;
  },
};