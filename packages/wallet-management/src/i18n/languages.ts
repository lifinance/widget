import type { LanguageKey } from '../providers/I18nProvider/types.js'

const loadLanguage = async (language: LanguageKey) => {
  try {
    return (await import(`./${language}.json`)).default
  } catch (error: unknown) {
    console.warn(`Failed to load language ${language}:`, error)
    throw new Error(`Unsupported language: ${language}`)
  }
}

// Cache for loaded languages
const languageCache = new Map<LanguageKey, any>()

// Load language with caching
export const loadLanguageDynamic = async (
  language: LanguageKey
): Promise<any> => {
  if (languageCache.has(language)) {
    return languageCache.get(language)
  }

  try {
    const translations = await loadLanguage(language)
    languageCache.set(language, translations)
    return translations
  } catch (error) {
    console.warn(`Failed to load language ${language}:`, error)
    // Fallback to English if available
    if (language !== 'en') {
      return loadLanguageDynamic('en')
    }
    throw error
  }
}
