import { api } from "@/lib/axios";
import { headers } from "next/headers";

export const studentService = {
  getStudentByInstructorId: async (ma_giang_vien: number) => {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

    try {
      const res = await api.get(`/student/instructor/${ma_giang_vien}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return res.data;
    } catch (error) {
      console.log(`Failed to fetch student by instructor ID: ${error}`);
    }
  },
}