import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import type { FC, PropsWithChildren } from 'react'
import { useEffect, useMemo } from 'react'
import { I18nextProvider } from 'react-i18next'
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
      lng: locale || 'en',
      fallbackLng: 'en',
      lowerCaseLng: true,
      interpolation: {
        escapeValue: false,
      },
      returnEmptyString: false,
    })

    i18n.use(
      resourcesToBackend(
        (language: LanguageKey) => import(`../../i18n/${language}.json`)
      )
    )

    i18n.init()

    return i18n
  }, [locale])

  useEffect(() => {
    if (locale && locale !== i18nInstance.language) {
      i18nInstance.changeLanguage(locale)
    }
  }, [locale, i18nInstance])

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
}
