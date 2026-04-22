import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, translations, Translations } from '../i18n/translations'
import { loadTranslations } from '../i18n/lazyTranslations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Map country codes to supported languages
const countryToLanguage: Record<string, Language> = {
  'CN': 'zh', // China
  'US': 'en', // United States
  'GB': 'en', // United Kingdom
  'CA': 'en', // Canada
  'AU': 'en', // Australia
  'ES': 'es', // Spain
  'MX': 'es', // Mexico
  'AR': 'es', // Argentina
  'FR': 'fr', // France
  'BE': 'fr', // Belgium
  'CH': 'fr', // Switzerland
  'DE': 'de', // Germany
  'AT': 'de', // Austria
  'JP': 'ja', // Japan
  'KR': 'ko', // South Korea
  'BR': 'pt', // Brazil
  'PT': 'pt', // Portugal
  'RU': 'ru', // Russia
  'AE': 'ar', // UAE
  'SA': 'ar', // Saudi Arabia
  'EG': 'ar', // Egypt
}

// Detect language from browser
const getBrowserLanguage = (): Language => {
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('zh')) return 'zh'
  if (browserLang.startsWith('es')) return 'es'
  if (browserLang.startsWith('fr')) return 'fr'
  if (browserLang.startsWith('de')) return 'de'
  if (browserLang.startsWith('ja')) return 'ja'
  if (browserLang.startsWith('ko')) return 'ko'
  if (browserLang.startsWith('ar')) return 'ar'
  if (browserLang.startsWith('pt')) return 'pt'
  if (browserLang.startsWith('ru')) return 'ru'
  return 'en'
}

// Detect language from IP address
const detectLanguageFromIP = async (): Promise<Language | null> => {
  try {
    // Using ipapi.co (free tier: 1000 requests/day)
    const response = await fetch('https://ipapi.co/json/')
    if (!response.ok) throw new Error('IP detection failed')
    
    const data = await response.json()
    const countryCode = data.country_code
    
    if (countryCode && countryToLanguage[countryCode]) {
      return countryToLanguage[countryCode]
    }
    return null
  } catch (error) {
    console.warn('IP-based language detection failed:', error)
    return null
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [currentTranslations, setCurrentTranslations] = useState<Translations>(translations.en)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load translations when language changes
  useEffect(() => {
    const loadLangTranslations = async () => {
      if (!isInitialized) return
      
      console.log(`[i18n] Language changed to: ${language}`)
      setIsLoading(true)
      try {
        const loadedTranslations = await loadTranslations(language)
        setCurrentTranslations(loadedTranslations)
        console.log(`[i18n] Translations loaded successfully for: ${language}`)
      } catch (error) {
        console.error(`[i18n] Failed to load translations for ${language}:`, error)
        setCurrentTranslations(translations.en)
      } finally {
        setIsLoading(false)
      }
    }

    loadLangTranslations()
  }, [language, isInitialized])

  useEffect(() => {
    const initializeLanguage = async () => {
      // Priority 1: Check localStorage (user's explicit choice)
      const saved = localStorage.getItem('language')
      if (saved && translations[saved as Language]) {
        setLanguageState(saved as Language)
        setIsInitialized(true)
        return
      }

      // Priority 2: Try IP-based detection for first-time visitors
      const detectedLang = await detectLanguageFromIP()
      if (detectedLang) {
        setLanguageState(detectedLang)
        setIsInitialized(true)
        return
      }

      // Priority 3: Fallback to browser language
      const browserLang = getBrowserLanguage()
      setLanguageState(browserLang)
      setIsInitialized(true)
    }

    initializeLanguage()
  }, [])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('language', language)
      document.documentElement.lang = language
    }
  }, [language, isInitialized])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: currentTranslations, isLoading }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
