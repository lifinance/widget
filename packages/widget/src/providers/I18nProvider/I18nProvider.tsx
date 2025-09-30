import { createInstance } from 'i18next'
import { useEffect, useMemo } from 'react'
import { I18nextProvider } from 'react-i18next'
import { useSettings } from '../../stores/settings/useSettings.js'
import { compactNumberFormatter } from '../../utils/compactNumberFormatter.js'
import { currencyExtendedFormatter } from '../../utils/currencyExtendedFormatter.js'
import { isItemAllowed } from '../../utils/item.js'
import { percentFormatter } from '../../utils/percentFormatter.js'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import { enResource } from './enResource.js'
import { loadLocale, mergeWithLanguageResources } from './i18n.js'
import type { LanguageKey } from './types.js'

export const I18nProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { languages, languageResources } = useWidgetConfig()
  const { language, defaultLanguage, defaultLanguageCache } = useSettings([
    'language',
    'defaultLanguage',
    'defaultLanguageCache',
  ])
  const hasDefaultTranslations = defaultLanguage && defaultLanguageCache
  const shouldFallbackToEnglish =
    isItemAllowed('en', languages) || !hasDefaultTranslations

  const i18nInstance = useMemo(() => {
    const i18n = createInstance({
      lng: defaultLanguage,
      fallbackLng: shouldFallbackToEnglish ? 'en' : defaultLanguage,
      lowerCaseLng: true,
      interpolation: { escapeValue: false },
      resources: {
        ...(shouldFallbackToEnglish && {
          en: {
            translation: mergeWithLanguageResources(
              enResource,
              languageResources?.en
            ),
          },
        }),
        ...(hasDefaultTranslations && {
          [defaultLanguage as LanguageKey]: {
            translation: mergeWithLanguageResources(
              defaultLanguageCache,
              languageResources?.[defaultLanguage as LanguageKey]
            ),
          },
        }),
      },
      detection: {
        caches: [],
      },
      returnEmptyString: false,
    })

    i18n.init()

    i18n.services.formatter?.addCached('numberExt', compactNumberFormatter)
    i18n.services.formatter?.addCached('currencyExt', currencyExtendedFormatter)
    i18n.services.formatter?.addCached('percent', percentFormatter)

    return i18n
  }, [
    defaultLanguage,
    defaultLanguageCache,
    languageResources,
    shouldFallbackToEnglish,
    hasDefaultTranslations,
  ])

  useEffect(() => {
    const handleLanguageChange = async () => {
      const locale = language as LanguageKey
      if (!i18nInstance.hasResourceBundle(locale, 'translation')) {
        await loadLocale(locale, languageResources?.[locale]).then(
          (languageResource) => {
            i18nInstance.addResourceBundle(
              locale,
              'translation',
              languageResource,
              true,
              true
            )
          }
        )
      }
      if (locale !== i18nInstance.language) {
        await i18nInstance.changeLanguage(locale)
      }
    }

    handleLanguageChange()
  }, [language, languageResources, i18nInstance])

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
}
