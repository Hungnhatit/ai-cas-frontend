import { api } from '@/lib/axios';

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

  getAllTests: async () => {
    try {
      const res = await api.get('/test/all-tests');
      return res.data;
    } catch (error) {
      console.log(error);
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

  assignTestToStudent: async (test_id: number, data: any) => {
    try {
      const res = await api.post(`/test/${test_id}/assign`, data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },


  updateTest: async (test_id: number, data: any) => {
    const token = localStorage.getItem("token");
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

  deleteTest: async (test_id: number, force = false) => {
    const token = localStorage.getItem("token");
    try {
      const res = await api.delete(`/test/remove/${test_id}?${force ? 'force=true' : ''}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return res.data;
    } catch (error: any) {
      console.log('Delete test error: ', error.res?.data || error.message);
      throw error;
    }
  },

  restoreTest: async (test_id: number) => {
    const token = localStorage.getItem("token");
    try {
      const res = await api.patch(`/test/${test_id}/restore`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return res.data;
    } catch (error: any) {
      console.log('Error when restoring test: ', error.res?.data || error.message);
      throw error;
    }
  }

}
