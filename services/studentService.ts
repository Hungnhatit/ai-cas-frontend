import { api } from "@/lib/axios";
import { headers } from "next/headers";

export const studentService = {
  getStudentByInstructorId: async (instructor_id: number) => {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

    try {
      const res = await api.get(`/student/instructor/${instructor_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return res.data;
    } catch (error) {
      console.error(`Failed to fetch student by instructor ID: ${error}`);
    }
  },
}