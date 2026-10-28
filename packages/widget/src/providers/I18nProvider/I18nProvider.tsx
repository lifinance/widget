import { createInstance, type i18n } from 'i18next'
import { useEffect, useMemo, useRef } from 'react'
import { I18nextProvider } from 'react-i18next'
import { useLanguages } from '../../hooks/useLanguages.js'
import { useSettingsStore } from '../../stores/settings/SettingsStore.js'
import { useSettings } from '../../stores/settings/useSettings.js'
import { compactNumberFormatter } from '../../utils/compactNumberFormatter.js'
import { currencyExtendedFormatter } from '../../utils/currencyExtendedFormatter.js'
import { percentFormatter } from '../../utils/percentFormatter.js'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import { allLanguages } from './constants.js'
import { enResource } from './enResource.js'
import { mergeWithLanguageResources } from './i18n.js'
import type { LanguageKey, LanguageResource, PartialResource } from './types.js'

export const I18nProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { languages, languageResources } = useWidgetConfig()
  const { language, languageCache } = useSettings(['language', 'languageCache'])
  const i18nInstanceRef = useRef<i18n | null>(null)
  // The language cache that the instance already holds.
  const addedLanguageCacheRef = useRef(languageCache)

  const i18nInstance = useMemo(() => {
    if (i18nInstanceRef.current) {
      return i18nInstanceRef.current
    }

    // Custom language resources (of non-default languages) are added statically.
    // If custom language resources extend existing languages, they are merged with dynamically loaded resources.
    const customLanguageKeys = languageResources
      ? Object.keys(languageResources).filter(
          (key: string) => !allLanguages.includes(key as LanguageKey)
        )
      : []
    const initialLanguage = language || languages?.default
    const i18n = createInstance({
      lng: initialLanguage,
      fallbackLng: 'en',
      lowerCaseLng: true,
      interpolation: { escapeValue: false },
      // Re-render `useTranslation` consumers when strings are added, not only
      // on `languageChanged`. Memoized components such as the navigation tabs
      // otherwise keep the strings of their first render.
      react: { bindI18nStore: 'added' },
      resources: {
        en: {
          translation: mergeWithLanguageResources(
            enResource,
            languageResources?.en
          ),
        },
        ...(initialLanguage &&
          initialLanguage !== 'en' &&
          languageCache && {
            [initialLanguage]: {
              translation: languageCache,
            },
          }),
        // Add non-existing custom language resources
        ...customLanguageKeys.reduce(
          (acc, key) => {
            const customResource = languageResources?.[key as LanguageKey]
            if (customResource) {
              acc[key] = {
                translation: customResource,
              }
            }
            return acc
          },
          {} as Record<
            string,
            { translation: PartialResource<LanguageResource> }
          >
        ),
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
    i18nInstanceRef.current = i18n
    return i18n
  }, [language, languageResources, languages?.default, languageCache])

  // Add language cache updates after the commit, so that the `added` event
  // does not update other components during this render.
  useEffect(() => {
    if (languageCache === addedLanguageCacheRef.current) {
      return
    }
    addedLanguageCacheRef.current = languageCache
    if (language && languageCache && language !== 'en') {
      i18nInstance.addResourceBundle(
        language,
        'translation',
        languageCache,
        true,
        true
      )
    }
  }, [i18nInstance, language, languageCache])

  return (
    <I18nextProvider i18n={i18nInstance}>
      {children}
      <DefaultLanguageHandler />
    </I18nextProvider>
  )
}

// Sync language settings internally when config.languages.default changes externally
const DefaultLanguageHandler: React.FC = () => {
  const { languages } = useWidgetConfig()
  const [lastDefaultLanguage, setValue] = useSettingsStore((state) => [
    state.lastDefaultLanguage,
    state.setValue,
  ])
  const { setLanguageWithCode: setLanguage } = useLanguages()

  useEffect(() => {
    const currentDefaultLanguage = languages?.default

    const defaultLanguageChanged =
      currentDefaultLanguage && currentDefaultLanguage !== lastDefaultLanguage

    if (!defaultLanguageChanged) {
      return
    }

    const updateLanguage = async () => {
      await setLanguage(currentDefaultLanguage)
      setValue('lastDefaultLanguage', currentDefaultLanguage)
    }

    updateLanguage()
  }, [languages?.default, setValue, lastDefaultLanguage, setLanguage])

  return null
}
