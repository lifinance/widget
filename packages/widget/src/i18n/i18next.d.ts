import en from './en.json' with { type: 'json' }

const defaultResource = { translation: en }

declare global {
  namespace GeneralTranslation {
    declare module 'i18next' {
      interface CustomTypeOptions {
        defaultNS: 'translation'
        resources: typeof defaultResource
      }
    }
  }
}
