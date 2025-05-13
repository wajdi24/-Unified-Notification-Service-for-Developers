
import axios, { type AxiosInstance } from 'axios';
const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});


axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        // config.headers['Accept-Language'] = i18n.language;
    }

    return config;
});

axiosInstance.interceptors.response.use((response: any) => response);

export default axiosInstance;