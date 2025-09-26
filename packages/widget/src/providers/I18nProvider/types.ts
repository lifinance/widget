import type { enResource } from './enResource.js'

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

export type LanguageResource = typeof enResource

export type LanguageResources =
  | {
      [K in LanguageKey]?: PartialResource<LanguageResource>
    }
  | {
      [language: string]: PartialResource<LanguageResource>
    }
