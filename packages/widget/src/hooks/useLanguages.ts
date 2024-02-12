import { useTranslation } from 'react-i18next';
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js';
import { useSettings } from '../stores/settings/useSettings.js';
import { useSettingsStore } from '../stores/settings/useSettingsStore.js';

export const useLanguages = () => {
  const { t, i18n } = useTranslation();
  const { languages } = useWidgetConfig();
  const { language } = useSettings(['language']);
  const setValue = useSettingsStore((state) => state.setValue);

  const sortedLanguages = Object.keys(i18n.store.data).sort();

  const selectedLanguageCode = sortedLanguages.includes(
    language || i18n.resolvedLanguage || '',
  )
    ? language || i18n.resolvedLanguage
    : languages?.default || languages?.allow?.[0];

  return {
    availableLanguages: sortedLanguages,
    selectedLanguageCode: selectedLanguageCode,
    selectedLanguageDisplayName: t('language.name', {
      lng: selectedLanguageCode,
    }),
    setLanguageWithCode: (code: string) => {
      setValue('language', code);
      i18n.changeLanguage(code);
    },
  };
};
