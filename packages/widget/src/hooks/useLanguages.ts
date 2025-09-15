import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { allLanguages } from '../pages/LanguagesPage/constants.js'
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
    let supportedLanguages: LanguageKey[] = []
    if (!languagesConfig) {
      supportedLanguages = allLanguages
    } else {
      const languagesConfigSets = getConfigItemSets(
        languagesConfig,
        (languages) => new Set(languages)
      )
      supportedLanguages = allLanguages.filter((language) =>
        isItemAllowedForSets(language, languagesConfigSets)
      )
    }
    return supportedLanguages.sort()
  }, [languagesConfig])

  const selectedLanguage = (language ||
    i18n.resolvedLanguage ||
    '') as LanguageKey

  const selectedLanguageCode = sortedLanguages.includes(selectedLanguage)
    ? selectedLanguage
    : ((languagesConfig?.default ||
        languagesConfig?.allow?.[0] ||
        'en') as LanguageKey)

  return {
    availableLanguages: sortedLanguages,
    selectedLanguageCode: selectedLanguageCode,
    setLanguageWithCode: (code: string) => {
      setValue('language', code)
    },
  }
}
