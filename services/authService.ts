import { api } from '@/lib/axios';
import axios from 'axios';
export const authService = {
  login: async (email: string, mat_khau: string) => {
    const res = await api.post(`/auth/login`, { email, mat_khau });
    console.log(res.data)
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

  forgotPassword: async (email: string) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },

  resetPassword: async (payload: any) => {
    const res = await api.post('/auth/reset-password', payload);
    return res.data;
  }
};