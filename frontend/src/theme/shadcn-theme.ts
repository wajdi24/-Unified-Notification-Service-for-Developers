import { createTheme, alpha } from "@mui/material/styles"
import { enUS, frFR } from "@mui/material/locale"

// Shadcn-inspired color palette
const shadcnColors = {
  light: {
    background: "#ffffff",
    foreground: "#020817",
    card: "#ffffff",
    cardForeground: "#020817",
    popover: "#ffffff",
    popoverForeground: "#020817",
    primary: "#0f172a",
    primaryForeground: "#f8fafc",
    secondary: "#f1f5f9",
    secondaryForeground: "#0f172a",
    muted: "#f1f5f9",
    mutedForeground: "#64748b",
    accent: "#f1f5f9",
    accentForeground: "#0f172a",
    destructive: "#ef4444",
    destructiveForeground: "#f8fafc",
    border: "#e2e8f0",
    input: "#e2e8f0",
    ring: "#94a3b8",
  },
  dark: {
    background: "#020817",
    foreground: "#f8fafc",
    card: "#0f172a",
    cardForeground: "#f8fafc",
    popover: "#0f172a",
    popoverForeground: "#f8fafc",
    primary: "#f8fafc",
    primaryForeground: "#0f172a",
    secondary: "#1e293b",
    secondaryForeground: "#f8fafc",
    muted: "#1e293b",
    mutedForeground: "#94a3b8",
    accent: "#1e293b",
    accentForeground: "#f8fafc",
    destructive: "#ef4444",
    destructiveForeground: "#f8fafc",
    border: "#1e293b",
    input: "#1e293b",
    ring: "#94a3b8",
  },
}

// Create a shadcn-inspired theme for Material UI
const getShadcnTheme = (mode: "light" | "dark", locale: string) => {
  // Select locale
  let localeData
  switch (locale) {
    case "fr":
      localeData = frFR
      break
    default:
      localeData = enUS
  }

  const colors = mode === "light" ? shadcnColors.light : shadcnColors.dark

  // Create theme
  return createTheme(
    {
      palette: {
        mode,
        primary: {
          main: colors.primary,
          contrastText: colors.primaryForeground,
        },
        secondary: {
          main: colors.secondary,
          contrastText: colors.secondaryForeground,
        },
        error: {
          main: colors.destructive,
          contrastText: colors.destructiveForeground,
        },
        background: {
          default: colors.background,
          paper: colors.card,
        },
        text: {
          primary: colors.foreground,
          secondary: colors.mutedForeground,
        },
        divider: colors.border,
        action: {
          active: colors.foreground,
          hover: alpha(colors.foreground, 0.05),
          selected: alpha(colors.foreground, 0.1),
          disabled: alpha(colors.foreground, 0.3),
          disabledBackground: alpha(colors.foreground, 0.12),
        },
      },
      typography: {
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        h1: {
          fontWeight: 700,
          fontSize: "2.25rem",
          lineHeight: 1.2,
          letterSpacing: "-0.025em",
        },
        h2: {
          fontWeight: 700,
          fontSize: "1.875rem",
          lineHeight: 1.2,
          letterSpacing: "-0.025em",
        },
        h3: {
          fontWeight: 600,
          fontSize: "1.5rem",
          lineHeight: 1.2,
          letterSpacing: "-0.025em",
        },
        h4: {
          fontWeight: 600,
          fontSize: "1.25rem",
          lineHeight: 1.2,
          letterSpacing: "-0.025em",
        },
        h5: {
          fontWeight: 600,
          fontSize: "1.125rem",
          lineHeight: 1.2,
        },
        h6: {
          fontWeight: 600,
          fontSize: "1rem",
          lineHeight: 1.2,
        },
        body1: {
          fontSize: "1rem",
          lineHeight: 1.5,
        },
        body2: {
          fontSize: "0.875rem",
          lineHeight: 1.5,
        },
        button: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
      shape: {
        borderRadius: 8,
      },
      shadows: [
        "none",
        "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        "0 25px 50px -12px rgb(0 0 0 / 0.25)",
        ...Array(18).fill("none"),
      ],
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
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: "0.375rem",
              fontWeight: 500,
              padding: "0.5rem 1rem",
              boxShadow: "none",
              textTransform: "none",
              transition: "all 150ms ease",
              "&:hover": {
                boxShadow: "none",
                transform: "translateY(-1px)",
              },
            },
            contained: {
              backgroundColor: colors.primary,
              color: colors.primaryForeground,
              "&:hover": {
                backgroundColor: alpha(colors.primary, 0.9),
              },
            },
            outlined: {
              borderColor: colors.border,
              "&:hover": {
                backgroundColor: alpha(colors.primary, 0.05),
              },
            },
            text: {
              "&:hover": {
                backgroundColor: alpha(colors.primary, 0.05),
              },
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              "& .MuiOutlinedInput-root": {
                borderRadius: "0.375rem",
                transition: "border-color 150ms ease",
                "& fieldset": {
                  borderColor: colors.input,
                  borderWidth: "1px",
                },
                "&:hover fieldset": {
                  borderColor: colors.ring,
                },
                "&.Mui-focused fieldset": {
                  borderColor: colors.ring,
                  borderWidth: "1px",
                  boxShadow: `0 0 0 2px ${alpha(colors.ring, 0.25)}`,
                },
              },
              "& .MuiInputLabel-root": {
                color: colors.mutedForeground,
              },
              "& .MuiInputBase-input": {
                padding: "0.75rem 1rem",
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: "0.5rem",
              borderColor: colors.border,
              boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: "0.5rem",
              borderColor: colors.border,
            },
          },
        },
        MuiSwitch: {
          styleOverrides: {
            root: {
              width: 42,
              height: 26,
              padding: 0,
              "& .MuiSwitch-switchBase": {
                padding: 0,
                margin: 2,
                transitionDuration: "300ms",
                "&.Mui-checked": {
                  transform: "translateX(16px)",
                  color: "#fff",
                  "& + .MuiSwitch-track": {
                    backgroundColor: colors.primary,
                    opacity: 1,
                    border: 0,
                  },
                },
              },
              "& .MuiSwitch-thumb": {
                boxSizing: "border-box",
                width: 22,
                height: 22,
              },
              "& .MuiSwitch-track": {
                borderRadius: 26 / 2,
                backgroundColor: mode === "light" ? colors.input : colors.muted,
                opacity: 1,
              },
            },
          },
        },
        MuiTab: {
          styleOverrides: {
            root: {
              textTransform: "none",
              fontWeight: 500,
              "&.Mui-selected": {
                color: colors.primary,
              },
            },
          },
        },
        MuiTabs: {
          styleOverrides: {
            indicator: {
              backgroundColor: colors.primary,
            },
          },
        },
        MuiListItem: {
          styleOverrides: {
            root: {
              borderRadius: "0.375rem",
            },
          },
        },
        MuiListItemButton: {
          styleOverrides: {
            root: {
              borderRadius: "0.375rem",
              "&.Mui-selected": {
                backgroundColor: alpha(colors.primary, 0.1),
              },
            },
          },
        },
        MuiAvatar: {
          styleOverrides: {
            root: {
              backgroundColor: colors.muted,
              color: colors.mutedForeground,
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: "0.375rem",
              fontWeight: 500,
            },
          },
        },
        MuiDivider: {
          styleOverrides: {
            root: {
              borderColor: colors.border,
            },
          },
        },
        MuiAlert: {
          styleOverrides: {
            root: {
              borderRadius: "0.375rem",
            },
          },
        },
        MuiLinearProgress: {
          styleOverrides: {
            root: {
              borderRadius: "0.25rem",
              backgroundColor: colors.muted,
            },
            bar: {
              borderRadius: "0.25rem",
            },
          },
        },
      },
    },
    localeData,
  )
}

// Create light and dark themes
export const shadcnLightTheme = getShadcnTheme("light", localStorage.getItem("language") || "en")
export const shadcnDarkTheme = getShadcnTheme("dark", localStorage.getItem("language") || "en")

// Update themes when language changes
export const updateShadcnThemesWithLocale = (locale: string) => {
  Object.assign(shadcnLightTheme, getShadcnTheme("light", locale))
  Object.assign(shadcnDarkTheme, getShadcnTheme("dark", locale))
}
