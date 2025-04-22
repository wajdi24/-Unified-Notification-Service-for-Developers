import i18n from "i18next"
import { initReactI18next } from "react-i18next"

// Import translations
import enTranslation from "./locales/en.json"
import frTranslation from "./locales/fr.json"

// Configure i18next
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    fr: {
      translation: frTranslation,
    },
  },
  lng: localStorage.getItem("language") || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  react: {
    useSuspense: false,
  },
})

export default i18n
