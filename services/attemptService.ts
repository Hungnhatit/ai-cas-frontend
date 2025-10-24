import { api } from "@/lib/axios";
import { headers } from "next/headers";

const token = localStorage.getItem("token");

export const attemptService = {
  getAttemptById: async (attempt_id: number) => {
    try {
      const res = await api.get(`/attempt/${attempt_id}`);
      return res.data.attempt;
    } catch (error) {
      console.log(error);
    }
  },
}