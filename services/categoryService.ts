import { api } from '@/lib/axios';

const handleError = (error: any) => {
  return {
    success: false,
    message:
      error?.response?.data?.message ||
      "An unexpected error occurred while processing the request.",
    error: error?.response?.data || error.message,
  };
};

export const categoryService = {
  getCategories: async () => {
    const res = await api.get('/category');
    return res.data;
  },
  getCategoryById: async (id: number) => {
    try {
      const res = await api.get(`/category/${id}`);
      return res.data;
    } catch (error) {
      return handleError(error);
    }
  },

  createCategory: async (payload: any) => {
    try {
      const res = await api.post("/category", payload);
      return res.data;
    } catch (error) {
      return handleError(error);
    }
  },

  updateCategory: async (id: number, payload: any) => {
    try {
      const res = await api.put(`/category/${id}`, payload);
      return res.data;
    } catch (error) {
      return handleError(error);
    }
  },

  updateCategoryStatus: async (id: number, status: string) => {
    try {
      const res = await api.patch(`/category/${id}/status`, {
        trang_thai: status,
      });
      return res.data;
    } catch (error) {
      return handleError(error);
    }
  },

  deleteCategory: async (id: number) => {
    try {
      const res = await api.delete(`/category/${id}`);
      return res.data;
    } catch (error) {
      return handleError(error);
    }
  },
}