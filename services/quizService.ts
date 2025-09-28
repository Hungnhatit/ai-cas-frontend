import { api } from "@/lib/axios";
import { headers } from "next/headers";

const token = localStorage.getItem("token");

export const quizService = {
  createQuiz: async (quizData: any) => {
    console.log(token)
    const res = await api.post(`/quizzes/create`, quizData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('res: ', res);
    return res.data;
  },

  publishQuiz: async (quiz_id: number, data: any) => {
    try {
      const res = await api.post(`/quizzes/${quiz_id}/publish`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return res.data
    } catch (error) {
      console.log(error);
    }
  },

  getQuizById: async (quiz_id: number) => {
    const res = await api.get(`/quizzes/${quiz_id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data.data;
  },

  getQuizByInstructorId: async (instructor_id: number) => {
    const res = await api.get(`/quizzes/instructor/${instructor_id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data.quizzes;
  },

  getQuizAttempt: async (quiz_id: number, student_id: number) => {
    const res = await api.get(`/attempt?quiz_id=${quiz_id}&student_id=${student_id}`)
    // console.log(res.data);
    return res.data
  },

  getQuizAttempts: async (student_id: number) => {
    const res = await api.get(`/attempt/student/${student_id}`);
    return res.data;
  },

  startQuizAttempt: async (quiz_id: number, student_id: number) => {
    const res = await api.post(`/attempt/start`, { quiz_id, student_id });
    return res.data
  },

  // save student's answer to a question in a quiz (not yet submit)
  submitQuizAnswer: async (attempt_id: number, answers: Record<number, string | number>): Promise<boolean> => {
    try {
      const res = await api.post(`/attempt/${attempt_id}/answer`, {
        answers
      });
      return res.status === 200;
    } catch (error) {
      console.error("Failed to submit quiz answer:", error);
      return false;
    }
  },

  // complete (submit) a quiz one, calculate score and save submitted status
  submitQuizAttempt: async (attempt_id: number): Promise<any> => {
    try {
      const res = await api.post(`/attempt/${attempt_id}/submit`);
      // res.data là attempt object đã update: { status, score, endTime, answers... }
      return res.data;
    } catch (error) {
      console.error("Failed to submit quiz attempt:", error);
      return null;
    }
  },

  getQuizResults: async (quiz_id: number, student_id: number) => {
    try {
      const res = await api.get(`/quizzes/${quiz_id}/student/${student_id}/results`);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },

  updateQuiz: async (quiz_id: number, data: any) => {
    try {
      const res = await api.put(`/quizzes/${quiz_id}/update`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return res.data;
    } catch (error) {
      console.log(error)
    }
  },

  deleteQuiz: async (quiz_id: number, force = false) => {
    try {
      const res = await api.delete(`/quizzes/remove/${quiz_id}${force ? '?force=true' : ''}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return res.data;
    } catch (error: any) {
      console.log('Delete quiz error: ', error.res?.data || error.message);
      throw error;
    }
  },

  restoreQuiz: async (quiz_id: number) => {
    try {
      const res = await api.patch(`/quizzes/restore/${quiz_id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return res.data;
    } catch (error: any) {
      console.log('Error when restoring quiz: ', error.res?.data || error.message);
      throw error;
    }
  }

}