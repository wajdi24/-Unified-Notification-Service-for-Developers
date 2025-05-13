import axios, { type AxiosError } from "axios"
import type { User } from "@/types/User"
import axiosInstance from "./axios"

// API response types for better type safety
interface AuthResponse {
  user: User
  token: string
  message?: string
}

interface MessageResponse {
  message: string
}

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor for handling common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      // Clear token if it's expired or invalid
      localStorage.removeItem("token")
      // You could also redirect to login page here
    }

    // Enhanced error message
    const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred"

    return Promise.reject(new Error(errorMessage))
  },
)

export const authApi = {
  /**
   * User login
   */
  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post<AuthResponse>("/auth/signin", data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * User registration
   */
  register: async (data: {
    name: string
    email: string
    password: string
    phone: string
  }): Promise<MessageResponse> => {
    try {
      const response = await axiosInstance.post<MessageResponse>("/auth/signup", data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email: string): Promise<MessageResponse> => {
    try {
      const response = await axiosInstance.post<MessageResponse>("/auth/forgot-password", { email })
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: {
    token: string
    password: string
  }): Promise<MessageResponse> => {
    try {
      const response = await axiosInstance.post<MessageResponse>("/auth/reset-password", data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Complete user profile
   */
  completeProfile: async (userData: Partial<User>): Promise<User> => {
    try {
      const response = await axiosInstance.post<User>("/auth/complete-profile", userData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    try {
      const response = await axiosInstance.put<User>("/user/update-profile", userData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get current user data
   */
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await axiosInstance.get<User>("/auth/me")
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Change user password
   */
  changePassword: async (data: {
    currentPassword: string
    newPassword: string
  }): Promise<MessageResponse> => {
    try {
      const response = await axiosInstance.patch<MessageResponse>("/auth/change-password", data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Logout user (clear token)
   */
  logout: async (): Promise<void> => {
    try {
      // Optional: Call backend to invalidate token
      await axiosInstance.post("/auth/logout")
    } catch (error) {
      // Even if the server call fails, clear the local token
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("token")
    }
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (token: string): Promise<MessageResponse> => {
    try {
      const response = await axiosInstance.get<MessageResponse>(`/auth/verify-email?token=${token}`)
      return response.data
    } catch (error) {
      throw error
    }
  },
}

export default authApi
