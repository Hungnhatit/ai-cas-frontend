import { api } from "@/lib/axios"
import { headers } from "next/headers";

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

  getTestsAttemptByStudent: async (student_id: number) => {
    try {
      const res = await api.get(`/test-attempt/student/${student_id}/test`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  getTestAttemptByStudentId: async (student_id: number, test_id: number) => {
    try {
      const res = await api.get(`/test-attempt/student/${student_id}/test/${test_id}`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  getTestAttempts: async (test_id: number, student_id: number) => {
    try {
      const res = await api.get(`/test-attempt?test_id=${test_id}&student_id=${student_id}`);
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

  abortAttempt: async (attempt_id: number) => {
    const token = localStorage.getItem("token");
    const res = await api.post(`/test-attempt/${attempt_id}/abort`, {}, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  },
}