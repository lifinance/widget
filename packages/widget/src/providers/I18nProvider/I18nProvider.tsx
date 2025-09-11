import { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import { useSettings } from '../../stores/settings/useSettings.js'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import i18nInstance, { changeLanguage } from './i18n.js'
import type { LanguageKey } from './types.js'

export const I18nProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { languageResources } = useWidgetConfig()
  const { language } = useSettings(['language'])

  useEffect(() => {
    if (language) {
      const languageKey = language as LanguageKey
      changeLanguage(languageKey, languageResources?.[languageKey])
    }
  }, [language, languageResources])

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
}
