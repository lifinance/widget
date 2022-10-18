import 'react-i18next';
import en from './en.json';

const defaultResource = { translation: en };

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: typeof defaultResource;
  }
}
