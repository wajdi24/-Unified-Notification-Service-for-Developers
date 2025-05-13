"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { authApi } from "../api/authApi"
import axios from "axios"
import { User } from "@/types/User"

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"



interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  requestPasswordReset: (email: string) => Promise<void>
  resetPassword: (token: string, password: string) => Promise<void>
  setPassword: (token: string, password: string, confirmPassword: string) => Promise<void>
  completeProfile: (userData: Partial<User>) => Promise<void>
  updateProfile: (userData: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  console.log('----------', user);

  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  // Check if user is authenticated on mount
  const checkAuth = async () => {
    try {

      setIsLoading(true)
      const token = localStorage.getItem("token")

      if (token) {
        const userData = await authApi.getCurrentUser()
        setUser(userData)
      } else { setUser(null) }
    } catch (error) {

      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (user === undefined) return;
    if (token) {
      if (user === null) {
        navigate("/login")
      } else {
        if (!user?.isProfileCompleted) {
          navigate("/complete-profile")
        }
        else if (pathname === '/complete-profile' || pathname === '/login') {
          navigate("/dashboard")
        }
      }

    }
  }, [pathname, user])

  // ✅ Login function
  const login = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/signin`, { email, password });
    const data = response.data;

    localStorage.setItem("token", data.accessToken);
    checkAuth()
  };


  // Logout function
  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    navigate("/login")
  }

  // Request password reset
  const requestPasswordResetMutation = useMutation({
    mutationFn: authApi.requestPasswordReset,
  })

  const requestPasswordReset = async (email: string) => {
    await requestPasswordResetMutation.mutateAsync(email)
  }

  // Reset password
  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      navigate("/login")
    },
  })

  const resetPassword = async (token: string, password: string) => {
    await resetPasswordMutation.mutateAsync({ token, password })
  }

  // Set password
  const setPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      navigate("/login")
    },
  })

  const setPassword = async (token: string, password: string) => {
    await setPasswordMutation.mutateAsync({ token, password })
  }


  // Complete profile
  const completeProfileMutation = useMutation({
    mutationFn: authApi.completeProfile,
    onSuccess: (data) => {
      setUser(data)
      navigate("/dashboard")
    },
  })

  const completeProfile = async (userData: Partial<User>) => {
    // Ensure avatar is either a string or undefined
    const validUserData: Partial<User> = {
      ...userData,
      avatar: userData.avatar || undefined,  // If avatar is null, set it to undefined
    };

    await completeProfileMutation.mutateAsync(validUserData)
  }

  // Update profile
  const updateProfileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: () => {
      checkAuth()
    },
  })

  const updateProfile = async (userData: Partial<User>) => {
    await updateProfileMutation.mutateAsync(userData)
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    requestPasswordReset,
    resetPassword,
    setPassword,
    completeProfile,
    updateProfile,
  }


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
