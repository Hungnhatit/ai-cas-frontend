import { api } from "@/lib/axios";
import { ppid } from "process";

interface CreatePostPayload {
  ma_tac_gia: number | string;
  tieu_de: string;
  tom_tat?: string;
  noi_dung?: string;
  trang_thai?: string;
  danh_muc?: string;
  anh_bia?: File | null;
  files: File[]
}

export const PostService = {
  createPost: async (payload: CreatePostPayload) => {
    const formData = new FormData();
    const queryParams = new URLSearchParams();

    formData.append('tieu_de', payload.tieu_de);
    if (payload.tom_tat) formData.append('tom_tat', payload.tom_tat);
    if (payload.noi_dung) formData.append('noi_dung', payload.noi_dung);
    if (payload.trang_thai) formData.append('trang_thai', payload.trang_thai);
    if (payload.danh_muc) formData.append('danh_muc', payload.danh_muc);
    if (payload.anh_bia) {
      formData.append('anh_bia', payload.anh_bia);
    }
    if (payload.files && payload.files.length > 0) {
      payload.files.forEach((file) => {
        formData.append('files', file);
      })
    }

    try {
      const res = await api.post(`/post/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      return res.data;
    } catch (error: any) {
      throw error.res?.data || error.message;
    }
  },

  getPost: async (params: any) => {
    try {
      const res = await api.get('/post', {params});
      return res.data;
    } catch (error: any) {
      throw error.res?.data || error.message;
    }
  },

  getPostByInstructorId: async (instructor_id: number, params: { page?: number; limit?: number; q?: string; trang_thai?: string }) => {
    try {
      const res = await api.get(`/post/instructor/${instructor_id}`, {
        params: {
          page: params.page,
          limit: params.limit,
          q: params.q,
          trang_thai: (params.trang_thai && params.trang_thai !== 'all') ? params.trang_thai : undefined,
          ma_tac_gia: instructor_id
        }
      });
      return res.data;
    } catch (error: any) {
      throw error.res?.data || error.message;
    }
  },

  getPostByID: async (post_id: number) => {
    try {
      const res = await api.get(`/post/${post_id}`);
      return res.data;
    } catch (error: any) {
      throw error.res?.data || error.message;
    }
  },

  updatePost: async (post_id: number, payload: any) => {
    try {
      const res = await api.patch(`/post/${post_id}`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return res.data;
    } catch (error: any) {
      throw error.res?.data || error.message;
    }
  },

  deletePost: async (post_id: number) => {
    try {
      const res = await api.delete(`/post/${post_id}`);
      return res.data;
    } catch (error: any) {
      throw error.res?.data || error.message;
    }
  }
}