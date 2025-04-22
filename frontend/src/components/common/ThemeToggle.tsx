"use client"

import { useTranslation } from "react-i18next"
import { IconButton, Tooltip } from "@mui/material"
import { Brightness4 as DarkModeIcon, Brightness7 as LightModeIcon } from "@mui/icons-material"
import { useThemeMode } from "../../contexts/ThemeModeContext"

const ThemeToggle = () => {
  const { t } = useTranslation()
  const { themeMode, toggleThemeMode } = useThemeMode()

  return (
    <Tooltip title={t("toggleTheme")}>
      <IconButton onClick={toggleThemeMode} color="inherit">
        {themeMode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  )
}

export default ThemeToggle
