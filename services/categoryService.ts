import { api } from '@/lib/axios';

// Submit test answers and get results
export const categoryService = {
  getCategories: async () => {
    const res = await api.get('/category');
    return res.data;
  },
}