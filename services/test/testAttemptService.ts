import { api } from "@/lib/axios"

export const testAttemptService = {
  startTestAttempt: async (test_id: number, student_id: number) => {
    try {
      const res = await api.post('/test-attempt/start', { test_id, student_id });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
}