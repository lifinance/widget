import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { LanguageKey } from '../providers/I18nProvider/types.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { useSettings } from '../stores/settings/useSettings.js'
import { useSettingsActions } from '../stores/settings/useSettingsActions.js'
import { getSupportedLanguages } from '../utils/languages.js'

export const useLanguages = () => {
  const { i18n } = useTranslation()
  const { languages } = useWidgetConfig()
  const { language } = useSettings(['language'])
  const { setValue } = useSettingsActions()

  const sortedLanguages = useMemo(() => {
    const supportedLanguages = getSupportedLanguages(languages).sort()
    return supportedLanguages
  }, [languages])

  const selectedLanguage = (language ||
    i18n.resolvedLanguage ||
    '') as LanguageKey

  const selectedLanguageCode = sortedLanguages.includes(selectedLanguage)
    ? selectedLanguage
    : ((languages?.default || languages?.allow?.[0] || 'en') as LanguageKey)

  return {
    availableLanguages: sortedLanguages,
    selectedLanguageCode: selectedLanguageCode,
    setLanguageWithCode: (code: string) => {
      setValue('language', code)
    },
  }
}
