import { api } from '@/lib/axios';

// Submit test answers and get results
export const AiReviewService = {
  getAiReviewById: async (result_id: number) => {
    const res = await api.get(`/ai/${result_id}/result`);
    return res.data;
  }
}