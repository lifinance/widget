import i18next from 'i18next';
import en from './en.json';

export const defaultNS = 'translation';
export const resources = {
  en: {
    translation: en,
  },
} as const;

export const i18n = i18next.createInstance(
  {
    lng: 'en',
    fallbackLng: 'en',
    lowerCaseLng: true,
    interpolation: {
      escapeValue: false,
    },
    resources,
  },
  // providing an empty callback here will automatically call init
  () => {},
);
