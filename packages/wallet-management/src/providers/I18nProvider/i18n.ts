import type { LanguageKey, LanguageResource } from './types.js'

// Dynamically import JSON and register it
export async function loadLocale(lng: LanguageKey) {
  const languageResourceModule = await import(`../../i18n/${lng}.json`)
  return languageResourceModule.default as LanguageResource
}
