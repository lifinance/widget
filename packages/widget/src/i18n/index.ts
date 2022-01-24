import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translation from './en/translation.json';

export const resources = {
  en: {
    translation,
  },
} as const;

export function configureReactI18next() {
  i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    lowerCaseLng: true,
    interpolation: {
      escapeValue: false,
    },
    resources,
  });
}

