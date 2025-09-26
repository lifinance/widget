import { createInstance } from 'i18next'
import type { FC, PropsWithChildren } from 'react'
import { useEffect, useMemo } from 'react'
import { I18nextProvider } from 'react-i18next'
import { enResource } from './enResource.js'
import { loadLocale } from './i18n.js'
import type { LanguageKey } from './types.js'

interface I18nProviderProps {
  locale?: LanguageKey
}

export const I18nProvider: FC<PropsWithChildren<I18nProviderProps>> = ({
  children,
  locale,
}) => {
  const i18nInstance = useMemo(() => {
    const i18n = createInstance({
      lng: 'en',
      fallbackLng: 'en',
      lowerCaseLng: true,
      interpolation: { escapeValue: false },
      resources: {
        en: {
          translation: enResource,
        },
      },
      detection: {
        caches: [],
      },
      returnEmptyString: false,
    })
    i18n.init()
    return i18n
  }, [])

  useEffect(() => {
    const handleLanguageChange = async () => {
      if (locale) {
        if (!i18nInstance.hasResourceBundle(locale, 'translation')) {
          await loadLocale(locale).then((languageResource) => {
            i18nInstance.addResourceBundle(
              locale,
              'translation',
              languageResource,
              true,
              true
            )
          })
        }
        if (locale !== i18nInstance.language) {
          await i18nInstance.changeLanguage(locale)
        }
      }
    }
    handleLanguageChange()
  }, [locale, i18nInstance])

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
}
