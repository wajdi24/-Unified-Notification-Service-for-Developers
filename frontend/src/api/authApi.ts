// src/api/authApi.ts
import axios from "axios";
import { User } from "@/types/User";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

const authAxios = axios.create({
  baseURL: API_URL,
});

authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("🚀 Sending token:------------------------->", token); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authApi = {
  login: async (data: { email: string; password: string }) => {
    const response = await axios.post(`${API_URL}/auth/signin`, data);
    return response.data;
  },

  register: async (data: { name: string; email: string; password: string; phone: string }) => {
    const response = await axios.post(`${API_URL}/auth/signup`, data);
    return response.data;
  },

  requestPasswordReset: async (email: string) => {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
    return response.data;
  },

  resetPassword: async (data: { token: string; password: string }) => {
    const response = await axios.post(`${API_URL}/auth/reset-password`, data);
    return response.data;
  },

  completeProfile: async (userData: Partial<User>) => {
    const response = await authAxios.post("/auth/complete-profile", userData);
    return response.data;
  },

  updateProfile: async (userData: Partial<User>) => {
    const response = await authAxios.put("/user/update-profile", userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await authAxios.get(`${API_URL}/auth/me`);
    return response.data;
  },
  
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const token = localStorage.getItem("token")
    const response = await axios.patch(`${API_URL}/auth/change-password`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },
};

export default authApi;
