import axiosInstance from "./axios";


export interface ProjectPayload {
  name_project: string;
  user_id: string;
  config_email?: {
    mail_host?: string;
    mail_port?: number;
    email_user?: string;
    email_pass?: string;
    mail_from?: string;
  };
}


export interface UpdateProjectPayload extends ProjectPayload {
  id: string;
}

// Fetch all projects
export const fetchProjectsApi = async () => {
  const response = await axiosInstance.get(`/projects`);
  return response.data;
};

// Create new project
export const createProjectApi = async (data: ProjectPayload) => {
  const response = await axiosInstance.post(`/projects`, data);
  return response.data;
};


// Update project
export const updateProjectApi = async (data: UpdateProjectPayload) => {
  const { id, ...rest } = data;
  const response = await axiosInstance.put(`/projects/${id}`, rest);
  return response.data;
};

// Delete project
export const deleteProjectApi = async (id: string) => {
  const response = await axiosInstance.delete(`/projects/${id}`);
  return response.data;
};

// Generate API key
export const generateApiKeyApi = async () => {
  const response = await axiosInstance.post(`/projects/generate-api-key`);
  return response.data;
};
