import { api } from "@/lib/axios";
import { headers } from "next/headers";


export const assignmentService = {
  createAssignment: async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      const res = await api.post('/assignment/create', data);
      return res.data;
    } catch (error) {
      console.log(error)
    }
  },

  fetchAssignmentsByInstructorId: async (ma_giang_vien: number) => {
    const token = localStorage.getItem("token");
    try {
      const res = await api.get(`/assignment/instructor/${ma_giang_vien}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return res.data;
    } catch (error) {
      console.log(error)
    }
  },

  fetchAssignmentsForStudent: async (student_id: number) => {
    const token = localStorage.getItem("token");
    try {
      const res = await api.get(`/assignment/student/${student_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  fetchAssignmentById: async (assignment_id: number) => {
    const token = localStorage.getItem("token");
    try {
      const res = await api.get(`/assignment/${assignment_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
}