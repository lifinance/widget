import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { allLanguages } from '../providers/I18nProvider/constants.js'
import type { LanguageKey } from '../providers/I18nProvider/types.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { useSettings } from '../stores/settings/useSettings.js'
import { useSettingsActions } from '../stores/settings/useSettingsActions.js'
import { getConfigItemSets, isItemAllowedForSets } from '../utils/item.js'

export const useLanguages = () => {
  const { i18n } = useTranslation()
  const { languages: languagesConfig } = useWidgetConfig()
  const { language } = useSettings(['language'])
  const { setValue } = useSettingsActions()

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

  const selectedLanguage = language || i18n.resolvedLanguage || ''
  const selectedLanguageCode = sortedLanguages.includes(selectedLanguage)
    ? selectedLanguage
    : languagesConfig?.default || 'en'

  return {
    availableLanguages: sortedLanguages,
    selectedLanguageCode: selectedLanguageCode,
    setLanguageWithCode: (code: string) => {
      setValue('language', code)
    },
  }
}
