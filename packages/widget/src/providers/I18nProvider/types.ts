import en from '../../i18n/en.json' with { type: 'json' }

export type PartialResource<T> = T extends object
  ? {
      [P in keyof T]?: PartialResource<T[P]>
    }
  : T

export type LanguageKey =
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'it'
  | 'pt'
  | 'ja'
  | 'ko'
  | 'zh'
  | 'hi'
  | 'bn'
  | 'th'
  | 'vi'
  | 'tr'
  | 'uk'
  | 'id'
  | 'pl'

export type LanguageResource = typeof en

export type LanguageTranslationResources = {
  [K in LanguageKey]?: {
    translation: LanguageResource
  }
}

export type LanguageResources =
  | {
      [K in LanguageKey]?: PartialResource<LanguageResource>
    }
  | {
      [language: string]: PartialResource<LanguageResource>
    }
