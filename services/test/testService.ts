import { api } from '@/lib/axios';

const token = localStorage.getItem("token");

// Submit test answers and get results
export const testService = {
  createTest: async (data: any) => {
    try {
      const res = await api.post('/test/create', data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  getTestById: async (test_id: number) => {
    try {
      const res = await api.get(`/test/${test_id}`);
      return res.data;
    } catch (error) {
      console.log(`Error when fetching test: ${error}`);
    }
  },

  getTestsByInstructorId: async (instructor_id: number) => {
    try {
      const res = await api.get(`/test/instructor/${instructor_id}`);
      return res.data;
    } catch (error) {
      console.log(error)
    }
  },

  getTestResults: async (test_id: number, student_id: number) => {
    // router.get('/:test_id/student/:student_id/results', 
    try {
      const res = await api.get(`/test/${test_id}/student/${student_id}/results`);
      return res.data;
    } catch (error) {
      console.log(error)
    }
  },

  updateTest: async (test_id: number, data: any) => {
    try {
      const res = await api.put(`/test/${test_id}/update`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

}
