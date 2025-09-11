import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { compactNumberFormatter } from '../../utils/compactNumberFormatter.js'
import { currencyExtendedFormatter } from '../../utils/currencyExtendedFormatter.js'
import { deepMerge } from '../../utils/deepMerge.js'
import { percentFormatter } from '../../utils/percentFormatter.js'
import type { LanguageKey, LanguageResource, PartialResource } from './types.js'

// Dynamically import JSON and register it
async function loadLocale(
  lng: LanguageKey,
  customLanguageResource?: PartialResource<LanguageResource>
) {
  const languageResourceModule = await import(`../../i18n/${lng}.json`)
  const languageResource = languageResourceModule.default as LanguageResource
  const translations = customLanguageResource
    ? deepMerge(languageResource, customLanguageResource)
    : languageResource
  i18n.addResourceBundle(lng, 'translation', translations, true, true)
}

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  lowerCaseLng: true,
  interpolation: { escapeValue: false },
  resources: {},
  detection: {
    caches: [],
  },
  returnEmptyString: false,
})

i18n.services.formatter?.addCached('numberExt', compactNumberFormatter)
i18n.services.formatter?.addCached('currencyExt', currencyExtendedFormatter)
i18n.services.formatter?.addCached('percent', percentFormatter)

await loadLocale('en')

export async function changeLanguage(
  lng: LanguageKey,
  customLanguageResource?: PartialResource<LanguageResource>
) {
  if (!i18n.hasResourceBundle(lng, 'translation')) {
    await loadLocale(lng, customLanguageResource)
  }
  await i18n.changeLanguage(lng)
}

export default i18n
