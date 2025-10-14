import type { enResource } from './enResource.js'
import type { LanguageKey } from './types.js'

type LanguageResource = typeof enResource

// Dynamically import the JSON file for the specified language
export async function loadLocale(lng: LanguageKey) {
  const languageResourceModule = await import(`../../i18n/${lng}.json`)
  return languageResourceModule.default as LanguageResource
}
