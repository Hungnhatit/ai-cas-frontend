import { api } from "@/lib/axios";
import { headers } from "next/headers";

const token = localStorage.getItem("token");

export const assignmentService = {
  createAssignment: async (data: any) => {
    try {
      const res = await api.post('/assignment/create', data);
      return res.data;
    } catch (error) {
      console.log(error)
    }
  }
}