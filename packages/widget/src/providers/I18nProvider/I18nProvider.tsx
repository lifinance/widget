import { createInstance } from 'i18next'
import { startTransition, useEffect, useMemo, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { useSettings } from '../../stores/settings/useSettings.js'
import { compactNumberFormatter } from '../../utils/compactNumberFormatter.js'
import { currencyExtendedFormatter } from '../../utils/currencyExtendedFormatter.js'
import { percentFormatter } from '../../utils/percentFormatter.js'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import { enResource } from './enResource.js'
import { loadLocale } from './i18n.js'
import type { LanguageKey } from './types.js'
import { makeEmptyStrings } from './utils.js'

export const I18nProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { languageResources } = useWidgetConfig()
  const { language } = useSettings(['language'])
  const [isInitialized, setIsInitialized] = useState(false)

  const i18nInstance = useMemo(() => {
    const i18n = createInstance({
      lng: 'empty',
      fallbackLng: 'en',
      lowerCaseLng: true,
      interpolation: { escapeValue: false },
      // Show empty strings before the language resource is loaded
      resources: {
        empty: {
          translation: makeEmptyStrings(enResource),
        },
      },
      returnEmptyString: true,
    })

    i18n.init()

    i18n.services.formatter?.addCached('numberExt', compactNumberFormatter)
    i18n.services.formatter?.addCached('currencyExt', currencyExtendedFormatter)
    i18n.services.formatter?.addCached('percent', percentFormatter)

    return i18n
  }, [])

  useEffect(() => {
    const handleLanguageChange = async () => {
      const locale = language as LanguageKey | 'empty'

      // Always ensure English is loaded as fallback
      if (!i18nInstance.hasResourceBundle('en', 'translation')) {
        await loadLocale('en', languageResources?.en).then(
          (languageResource) => {
            i18nInstance.addResourceBundle(
              'en',
              'translation',
              languageResource,
              true,
              true
            )
          }
        )
      }

      if (locale && locale !== 'empty') {
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

  if (isInitialized) {
    // Show real strings after the language resource is loaded
    i18nInstance.options.returnEmptyString = false
  }

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
}
