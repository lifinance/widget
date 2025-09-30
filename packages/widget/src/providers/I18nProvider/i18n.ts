import { deepMerge } from '../../utils/deepMerge.js'
import type { LanguageKey, LanguageResource, PartialResource } from './types.js'

// Dynamically import the JSON file for the specified language
export async function loadLocale(
  lng: LanguageKey,
  customLanguageResource?: PartialResource<LanguageResource>
) {
  let languageResource: LanguageResource
  try {
    const languageResourceModule = await import(`../../i18n/${lng}.json`)
    languageResource = languageResourceModule.default as LanguageResource
  } catch {
    languageResource = {} as LanguageResource
  }
  return mergeWithLanguageResources(languageResource, customLanguageResource)
}

export function mergeWithLanguageResources(
  languageResource: LanguageResource,
  customLanguageResource?: PartialResource<LanguageResource>
) {
  return customLanguageResource
    ? deepMerge(languageResource, customLanguageResource)
    : languageResource
}
