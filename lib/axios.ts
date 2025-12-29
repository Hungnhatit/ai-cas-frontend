import axios from "axios";
import toast from "react-hot-toast";

export const api = axios.create({
  baseURL: ' http://localhost:8000/api', // ví dụ http://localhost:8000/api
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window != 'undefined') {
    const storage = localStorage.getItem('access_token');
    if (storage) {
      const { state } = JSON.parse(storage);
      if (state?.token) { config.headers.Authorization = `Bearer ${state.token}` }
    }
  }
  return config;
},
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        if (!path.includes("/auth/login") && !path.includes("/auth/register")) {
          toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_data");
          window.location.href = "/auth/login";
        }
      }
    }
    return Promise.reject(error);
  }
);