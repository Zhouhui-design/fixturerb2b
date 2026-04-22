import { Language, translations } from './translations'
import { supabase } from '../lib/supabase'

// Cache for loaded translations to avoid repeated fetches
const translationCache = new Map<string, any>()

// Track which languages have been fully loaded
const loadedLanguages = new Set<Language>()

/**
 * Load translations for a specific language on-demand
 * Falls back to bundled translations if Supabase is not available
 */
export async function loadTranslations(language: Language): Promise<any> {
  console.log(`[i18n] Loading translations for: ${language}`)
  
  // Return cached translations if already loaded
  if (translationCache.has(language)) {
    console.log(`[i18n] Using cached translations for: ${language}`)
    return translationCache.get(language)
  }

  // Check if we have complete bundled translations for this language
  const bundledTranslations = translations[language]
  const hasCompleteBundled = bundledTranslations && 
                             bundledTranslations.nav && 
                             bundledTranslations.hero &&
                             Object.keys(bundledTranslations).length > 5

  if (hasCompleteBundled) {
    console.log(`[i18n] Using bundled translations for: ${language}`)
    // Use bundled translations for well-supported languages
    translationCache.set(language, bundledTranslations)
    loadedLanguages.add(language)
    return bundledTranslations
  }

  console.log(`[i18n] Bundled translations incomplete for ${language}, trying Supabase...`)
  
  // For incomplete languages, try to load from Supabase
  try {
    console.log(`[i18n] Fetching from Supabase: translations where language='${language}'`)
    const { data, error } = await supabase
      .from('translations')
      .select('*')
      .eq('language', language)

    if (error) {
      console.warn(`[i18n] Failed to load translations from Supabase for ${language}:`, error.message)
      // Fallback to English
      console.log(`[i18n] Falling back to English for: ${language}`)
      return translations.en
    }

    console.log(`[i18n] Supabase returned ${data?.length || 0} translation rows for ${language}`)

    if (data && data.length > 0) {
      // Transform database rows into translation object
      const dynamicTranslations = transformDatabaseTranslations(data, language)
      translationCache.set(language, dynamicTranslations)
      loadedLanguages.add(language)
      console.log(`[i18n] Successfully loaded dynamic translations for: ${language}`)
      return dynamicTranslations
    }
  } catch (err) {
    console.warn(`[i18n] Error loading translations for ${language}:`, err)
  }

  // Final fallback to English
  console.log(`[i18n] No translations found for ${language}, using English fallback`)
  return translations.en
}

/**
 * Transform database rows into nested translation object
 */
function transformDatabaseTranslations(rows: any[], _language: Language): any {
  const result: any = {}

  rows.forEach(row => {
    const keys = row.key.split('.')
    let current = result

    // Navigate/create nested structure
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {}
      }
      current = current[keys[i]]
    }

    // Set the final value
    current[keys[keys.length - 1]] = row.value
  })

  // Merge with English base to ensure all keys exist
  return deepMerge({}, translations.en, result)
}

/**
 * Deep merge objects, with later objects overriding earlier ones
 */
function deepMerge(...objects: any[]): any {
  const result: any = {}

  objects.forEach(obj => {
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        result[key] = deepMerge(result[key] || {}, obj[key])
      } else {
        result[key] = obj[key]
      }
    })
  })

  return result
}

/**
 * Clear translation cache (useful for admin operations or language updates)
 */
export function clearTranslationCache(language?: Language) {
  if (language) {
    translationCache.delete(language)
    loadedLanguages.delete(language)
  } else {
    translationCache.clear()
    loadedLanguages.clear()
  }
}

/**
 * Check if translations for a language are loaded
 */
export function isLanguageLoaded(language: Language): boolean {
  return loadedLanguages.has(language)
}
