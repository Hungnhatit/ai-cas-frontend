import { api } from "@/lib/axios"

export const userService = {
  getUsers: async () => {
    const res = await api.get('/user');
    return res.data;
  },

  getUserById: async (user_id: number) => {
    const res = await api.get(`/user/${user_id}`);
    return res.data;
  },

  updateUser: async (user_id: number, data: any) => {
    const res = await api.patch(`/user/${user_id}`, data)
    return res.data
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
