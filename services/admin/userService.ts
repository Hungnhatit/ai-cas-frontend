import { api } from "@/lib/axios"

export const userService = {
  getUsers: async () => {
    const res = await api.get('/user');
    return res.data;
  },

  createUser: async (payload: any) => {
    const res = await api.post('/auth/sign-up', payload);
    return res.data
  },

  getUserById: async (user_id: number) => {
    const res = await api.get(`/user/${user_id}/detail`);
    return res.data;
  },

  updateUser: async (user_id: number, formData: FormData) => {
    const res = await api.patch(`/user/${user_id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  softDeleteUser: async (user_id: number) => {
    const res = await api.patch(`/user/${user_id}/soft-delete`)
    return res.data
  },

  restoreUser: async (user_id: number) => {
    const res = await api.patch(`/user/${user_id}/restore`)
    return res.data
  },

  forceDeleteUser: async (user_id: number) => {
    const res = await api.delete(`/user/${user_id}`)
    return res.data
  },
}
