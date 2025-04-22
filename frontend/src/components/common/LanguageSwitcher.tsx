"use client"

import type React from "react"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { IconButton, Menu, MenuItem, ListItemText, ListItemIcon, Tooltip } from "@mui/material"
import { Language as LanguageIcon } from "@mui/icons-material"
import { updateShadcnThemesWithLocale } from "../../theme/shadcn-theme"

// Language options
const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
]

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // Handle menu open/close
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  // Change language
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    updateShadcnThemesWithLocale(lng)
    handleClose()
  }

  // Get current language
  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0]

  return (
    <>
      <Tooltip title={t("changeLanguage")}>
        <IconButton onClick={handleOpen} color="inherit">
          <LanguageIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            selected={language.code === i18n.language}
          >
            <ListItemIcon sx={{ fontSize: "1.25rem" }}>{language.flag}</ListItemIcon>
            <ListItemText>{language.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default LanguageSwitcher
