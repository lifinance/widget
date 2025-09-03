import type * as languages from '../../i18n/index.js'

type PartialResource<T> = T extends object
  ? {
      [P in keyof T]?: PartialResource<T[P]>
    }
  : T

export type LanguageKey = keyof typeof languages

type LanguageResource = typeof languages.en

type LanguageTranslationResource = {
  [N in 'translation']: PartialResource<LanguageResource>
}

export type LanguageTranslationResources = {
  [language: string]: LanguageTranslationResource
}
