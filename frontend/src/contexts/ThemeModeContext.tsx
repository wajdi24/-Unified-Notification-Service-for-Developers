"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type ThemeMode = "light" | "dark"

interface ThemeModeContextType {
  themeMode: ThemeMode
  toggleThemeMode: () => void
  setThemeMode: (mode: ThemeMode) => void
}

const ThemeModeContext = createContext<ThemeModeContextType | undefined>(undefined)

export const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize theme from localStorage or system preference
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem("themeMode") as ThemeMode
    if (savedTheme) return savedTheme

    // Check system preference
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark"
    }

    return "light"
  })

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem("themeMode", themeMode)
  }, [themeMode])

  // Toggle theme function
  const toggleThemeMode = () => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"))
  }

  const value = {
    themeMode,
    toggleThemeMode,
    setThemeMode,
  }

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>
}

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext)
  if (context === undefined) {
    throw new Error("useThemeMode must be used within a ThemeModeProvider")
  }
  return context
}
