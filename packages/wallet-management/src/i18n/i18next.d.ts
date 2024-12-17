import en from './en.json' with { type: 'json' }

const defaultResource = { translation: en }

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: typeof defaultResource
  }
}
