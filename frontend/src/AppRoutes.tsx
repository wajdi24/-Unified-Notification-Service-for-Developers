"use client"

import type React from "react"

import { Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"

// Auth
import { useAuth } from "./contexts/AuthContext"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage"
import ResetPasswordPage from "./pages/auth/ResetPasswordPage"
import SetPasswordPage from "./pages/auth/SetPasswordPage"
import CompleteProfilePage from "./pages/auth/CompleteProfilePage"

// Dashboard
import DashboardLayout from "./layouts/DashboardLayout"
import DashboardHome from "./pages/dashboard/DashboardHome"
import ProfilePage from "./pages/dashboard/ProfilePage"
import SettingsPage from "./pages/dashboard/SettingsPage"

// Theme
import { shadcnLightTheme, shadcnDarkTheme } from "./theme/shadcn-theme"
import { useThemeMode } from "./contexts/ThemeModeContext"

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}

// App routes with theme
const AppRoutes = () => {
  const { themeMode } = useThemeMode()
  const theme = themeMode === "dark" ? shadcnDarkTheme : shadcnLightTheme

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/set-password" element={<SetPasswordPage />} />
          <Route path="/complete-profile" element={<CompleteProfilePage />} />

          {/* Dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 route */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default AppRoutes
