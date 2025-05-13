// src/api/templatesApi.ts
import { Template } from "@/types/Template";
import axiosInstance from "./axios";

// Use the VITE_BACKEND_URL from env, or default to localhost:5001


// Attach Authorization header dynamically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // assuming you store token in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fetch all templates
export const fetchTemplates = async (): Promise<Template[]> => {
  const { data } = await axiosInstance.get("/templates");
  return data;
};

// Create a new template
export const createTemplateApi = async (template: { title: string; subject: string; body: string, type: string }) => {
  const { data } = await axiosInstance.post("/templates", template);
  return data;
};

// Update a template
export const updateTemplateApi = async (template: { id: string; title: string; subject: string; body: string, type: string }) => {
  const { id, ...rest } = template;
  const { data } = await axiosInstance.put(`/templates/${id}`, rest);
  return data;
};

// Delete a template
export const deleteTemplateApi = async (id: string) => {
  const { data } = await axiosInstance.delete(`/templates/${id}`);
  return data;
};
