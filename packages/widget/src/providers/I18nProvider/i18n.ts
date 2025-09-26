import { deepMerge } from '../../utils/deepMerge.js'
import type { LanguageKey, LanguageResource, PartialResource } from './types.js'

// Dynamically import the JSON file for the specified language
export async function loadLocale(
  lng: LanguageKey,
  customLanguageResource?: PartialResource<LanguageResource>
) {
  const languageResourceModule = await import(`../../i18n/${lng}.json`)
  const languageResource = languageResourceModule.default as LanguageResource
  const translations = customLanguageResource
    ? deepMerge(languageResource, customLanguageResource)
    : languageResource
  return translations
}
