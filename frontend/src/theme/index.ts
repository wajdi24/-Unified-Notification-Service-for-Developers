import { createTheme } from "@mui/material/styles"
import { enUS, frFR } from "@mui/material/locale"

// Define common theme settings
const getTheme = (mode: "light" | "dark", locale: string) => {
  // Select locale
  let localeData
  switch (locale) {
    case "fr":
      localeData = frFR
      break
    default:
      localeData = enUS
  }

  // Create theme
  return createTheme(
    {
      palette: {
        mode,
        ...(mode === "light"
          ? {
              // Light mode palette
              primary: {
                main: "#1976d2",
              },
              secondary: {
                main: "#9c27b0",
              },
              background: {
                default: "#f5f5f5",
                paper: "#ffffff",
              },
            }
          : {
              // Dark mode palette
              primary: {
                main: "#90caf9",
              },
              secondary: {
                main: "#ce93d8",
              },
              background: {
                default: "#121212",
                paper: "#1e1e1e",
              },
            }),
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              scrollbarWidth: "thin",
              "&::-webkit-scrollbar": {
                width: "8px",
                height: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: mode === "light" ? "#f1f1f1" : "#2d2d2d",
              },
              "&::-webkit-scrollbar-thumb": {
                background: mode === "light" ? "#c1c1c1" : "#5c5c5c",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: mode === "light" ? "#a8a8a8" : "#6e6e6e",
              },
            },
          },
        },
      },
    },
    localeData,
  )
}

// Create light and dark themes
export const lightTheme = getTheme("light", localStorage.getItem("language") || "en")
export const darkTheme = getTheme("dark", localStorage.getItem("language") || "en")

// Update themes when language changes
export const updateThemesWithLocale = (locale: string) => {
  Object.assign(lightTheme, getTheme("light", locale))
  Object.assign(darkTheme, getTheme("dark", locale))
}
