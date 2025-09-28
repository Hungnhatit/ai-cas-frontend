import { api } from "@/lib/axios"

export const courseService = {
  getCourseByUser: async (user_id: number) => {
    const res = await api.get(`/course/get-course-by-user/${user_id}`);
    return res.data;
  }
}