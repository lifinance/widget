import { createInstance } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { startTransition, useEffect, useMemo, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { useSettings } from '../../stores/settings/useSettings.js'
import { compactNumberFormatter } from '../../utils/compactNumberFormatter.js'
import { currencyExtendedFormatter } from '../../utils/currencyExtendedFormatter.js'
import { deepMerge } from '../../utils/deepMerge.js'
import { percentFormatter } from '../../utils/percentFormatter.js'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import { enResource } from './enResource.js'
import { loadLocale } from './i18n.js'
import type { LanguageKey } from './types.js'

export const I18nProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { languageResources } = useWidgetConfig()
  const { language } = useSettings(['language'])
  const [isInitialized, setIsInitialized] = useState(false)

  const i18nInstance = useMemo(() => {
    const i18n = createInstance({
      lng: 'en',
      fallbackLng: 'en',
      lowerCaseLng: true,
      interpolation: { escapeValue: false },
      // Preload English statically as a fallback resource
      resources: {
        en: {
          translation: languageResources?.en
            ? deepMerge(enResource, languageResources?.en)
            : enResource,
        },
      },
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
        lookupLocalStorage: 'lifi-widget-language',
      },
      returnEmptyString: false,
    })

    i18n.use(LanguageDetector)

    i18n.init()

    i18n.services.formatter?.addCached('numberExt', compactNumberFormatter)
    i18n.services.formatter?.addCached('currencyExt', currencyExtendedFormatter)
    i18n.services.formatter?.addCached('percent', percentFormatter)

    return i18n
  }, [languageResources?.en])

  useEffect(() => {
    const handleLanguageChange = async () => {
      const locale = language as LanguageKey
      if (locale) {
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
    }

    try {
      handleLanguageChange()
    } finally {
      if (!isInitialized) {
        // Execute in the next tick to let i18nInstance be updated
        startTransition(() => {
          setIsInitialized(true)
        })
      }
    }
  }, [language, languageResources, i18nInstance, isInitialized])

  // Do not render until the selected language is initialized
  if (!isInitialized) {
    return null
  }

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
}
