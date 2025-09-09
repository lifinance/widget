import type { i18n } from 'i18next'
import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import type { FC, PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import type { LanguageKey } from './types.js'

interface I18nProviderProps {
  locale?: LanguageKey
}

export const I18nProvider: FC<PropsWithChildren<I18nProviderProps>> = ({
  children,
  locale,
}) => {
  const [i18nInstance, setI18nInstance] = useState<i18n | null>(null)

  useEffect(() => {
    const initI18n = async () => {
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
          (language: string) => import(`../../i18n/${language}.json`)
        )
      )

      await i18n.init()
      setI18nInstance(i18n)
    }

    initI18n()
  }, [locale])

  useEffect(() => {
    if (i18nInstance && locale && locale !== i18nInstance.language) {
      i18nInstance.changeLanguage(locale)
    }
  }, [locale, i18nInstance])

  return (
    <I18nextProvider i18n={i18nInstance as i18n}>{children}</I18nextProvider>
  )
}
