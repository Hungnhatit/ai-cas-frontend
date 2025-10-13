import { api } from "@/lib/axios"

export const testAttemptService = {
  startTestAttempt: async (test_id: number, student_id: number) => {
    try {
      const res = await api.post('/test-attempt/start', { test_id, student_id });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  getTestAttemptById: async (attempt_id: number) => {
    try {
      const res = await api.get(`/test-attempt/${attempt_id}/result`);
      return res.data;
    } catch (error) {
      console.log(error)
    }
  },
  
  submitTestAnswers: async (attempt_id: number, answers: Record<number, string | number>): Promise<boolean> => {
    try {
      const res = await api.post(`/test-attempt/${attempt_id}/submit-answers`, {
        answers
      });
      return res.status === 200;
    } catch (error) {
      return false
    }
  },

  // complete test a quiz one, calculate score and save submitted status
  submitTestAttempt: async (attempt_id: number) => {
    try {
      const res = await api.post(`/test-attempt/${attempt_id}/submit`);
      return res.data;
    } catch (error) {
      console.log('Failed to submit test attempt: ', error);
      return null
    }
  },
}