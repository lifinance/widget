import { createInstance } from 'i18next'
import type { FC, PropsWithChildren } from 'react'
import { useEffect, useMemo } from 'react'
import { I18nextProvider } from 'react-i18next'
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
      resources: {},
      detection: {
        caches: [],
      },
      returnEmptyString: false,
    })
    loadLocale('en').then((englishResource) => {
      i18n.addResourceBundle('en', 'translation', englishResource, true, true)
    })
    i18n.init()
    return i18n
  }, [])

  useEffect(() => {
    const handleLanguageChange = async () => {
      if (locale) {
        const languageResource = await loadLocale(locale)
        i18nInstance.addResourceBundle(
          locale,
          'translation',
          languageResource,
          true,
          true
        )
        await i18nInstance.changeLanguage(locale)
      }
    }
    handleLanguageChange()
  }, [locale, i18nInstance])

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
}
