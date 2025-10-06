import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { allLanguages } from '../providers/I18nProvider/constants.js'
import { loadLocale } from '../providers/I18nProvider/i18n.js'
import type {
  LanguageKey,
  LanguageResource,
} from '../providers/I18nProvider/types.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { useSettings } from '../stores/settings/useSettings.js'
import { useSettingsActions } from '../stores/settings/useSettingsActions.js'
import { getConfigItemSets, isItemAllowedForSets } from '../utils/item.js'

export const useLanguages = () => {
  const { i18n } = useTranslation()
  const { languages: languagesConfig, languageResources } = useWidgetConfig()
  const { language } = useSettings(['language'])
  const { setValues } = useSettingsActions()

  const sortedLanguages = useMemo(() => {
    const loadedLanguageKeys = Object.keys(i18n.store.data)
    // NB: custom language resources added statically to i18n might not exist in allLanguages (language files)
    const allLanguagesWithCustom = [
      ...new Set([...allLanguages, ...loadedLanguageKeys]),
    ]
    let supportedLanguages: (LanguageKey | string)[] = []
    if (!languagesConfig) {
      supportedLanguages = allLanguagesWithCustom
    } else {
      const languagesConfigSets = getConfigItemSets(
        languagesConfig,
        (languages) => new Set(languages)
      )
      supportedLanguages = allLanguagesWithCustom.filter((language) =>
        isItemAllowedForSets(language, languagesConfigSets)
      )
    }
    return supportedLanguages.sort()
  }, [languagesConfig, i18n.store.data])

  const handleLanguageChange = useCallback(
    async (languageKey: string) => {
      // Cache the language resource to prevent blinking
      // after switching languages and reloading the page.
      let newLanguageCache: LanguageResource | undefined
      if (
        !i18n.hasResourceBundle(languageKey, 'translation') &&
        languageKey !== 'en'
      ) {
        await loadLocale(
          languageKey as LanguageKey,
          languageResources?.[languageKey as LanguageKey]
        ).then((languageResource) => {
          i18n.addResourceBundle(
            languageKey,
            'translation',
            languageResource,
            true,
            true
          )
          newLanguageCache = languageResource
        })
      } else {
        // If the language is already loaded, just cache the existing resource
        newLanguageCache = i18n.getResourceBundle(languageKey, 'translation')
      }

      // Set the new language and language cache to the settings store.
      setValues({ language: languageKey, languageCache: newLanguageCache })

      // Update the i18n instance to the new language.
      if (languageKey !== i18n.language) {
        await i18n.changeLanguage(languageKey)
      }
    },
    [i18n, languageResources, setValues]
  )

  const selectedLanguage = language || i18n.resolvedLanguage || ''
  const selectedLanguageCode = sortedLanguages.includes(selectedLanguage)
    ? selectedLanguage
    : languagesConfig?.default || 'en'

  return {
    availableLanguages: sortedLanguages,
    selectedLanguageCode: selectedLanguageCode,
    setLanguageWithCode: handleLanguageChange,
  }
}
