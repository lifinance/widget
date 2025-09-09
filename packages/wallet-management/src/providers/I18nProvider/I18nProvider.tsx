import type { i18n } from 'i18next'
import { createInstance } from 'i18next'
import type { FC, PropsWithChildren } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { loadLanguageDynamic } from '../../i18n/languages.js'
import type { LanguageKey, LanguageTranslationResources } from './types.js'

interface I18nProviderProps {
  locale?: LanguageKey
}

export const I18nProvider: FC<PropsWithChildren<I18nProviderProps>> = ({
  children,
  locale,
}) => {
  const [resources, setResources] = useState<LanguageTranslationResources>({})

  const i18n = useMemo(() => {
    const i18nInstance = createInstance({
      lng: 'en', // Default language
      fallbackLng: 'en',
      lowerCaseLng: true,
      interpolation: {
        escapeValue: false,
      },
      resources: {},
      detection: {
        caches: [],
      },
      returnEmptyString: false,
    })

    return i18nInstance
  }, [])

  useEffect(() => {
    const loadInitialLanguage = async () => {
      try {
        const targetLocale = locale || 'en'

        // Always load English first as fallback
        const englishTranslation = await loadLanguageDynamic('en')
        const newResources: LanguageTranslationResources = {
          en: {
            translation: englishTranslation,
          },
        }

        // Load target language if it's not English
        if (targetLocale !== 'en') {
          const targetTranslation = await loadLanguageDynamic(targetLocale)
          newResources[targetLocale] = {
            translation: targetTranslation,
          }
        }

        setResources(newResources)

        // Initialize i18n with both languages
        await i18n.init({
          lng: targetLocale,
          resources: newResources,
        })
      } catch (error) {
        console.error('Failed to load initial language:', error)
        // Fallback to English
        if (locale !== 'en') {
          try {
            const fallbackTranslation = await loadLanguageDynamic('en')
            const fallbackResources: LanguageTranslationResources = {
              en: {
                translation: fallbackTranslation,
              },
            }
            setResources(fallbackResources)
            i18n.addResourceBundle(
              'en',
              'translation',
              fallbackTranslation,
              true,
              true
            )
            i18n.changeLanguage('en')
          } catch (fallbackError) {
            console.error('Failed to load fallback language:', fallbackError)
          }
        }
      }
    }

    loadInitialLanguage()
  }, [locale, i18n])

  // Load additional languages when locale changes
  useEffect(() => {
    const loadLanguage = async () => {
      if (!locale || locale === i18n.language) {
        return
      }

      try {
        if (resources[locale]) {
          i18n.changeLanguage(locale)
          return
        }

        const translation = await loadLanguageDynamic(locale)

        setResources((prev) => ({
          ...prev,
          [locale]: {
            translation,
          },
        }))

        await i18n.init({
          lng: locale,
          resources: {
            ...resources,
            [locale]: {
              translation,
            },
          },
        })
      } catch (error) {
        console.error(`Failed to load language ${locale}:`, error)
      }
    }

    loadLanguage()
  }, [locale, i18n, resources])

  return <I18nextProvider i18n={i18n as i18n}>{children}</I18nextProvider>
}
