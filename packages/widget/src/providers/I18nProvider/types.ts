import type * as languages from '../../i18n/index.js';

export type PartialResource<T> = T extends object
  ? {
      [P in keyof T]?: PartialResource<T[P]>;
    }
  : T;

export type LanguageKey = keyof typeof languages;

export type LanguageResource = typeof languages.en;

export type LanguageResources =
  | {
      [language in LanguageKey]?: PartialResource<LanguageResource>;
    }
  | {
      [language: string]: PartialResource<LanguageResource>;
    };

export type LanguageTranslationResource = {
  [namespace in 'translation']: PartialResource<LanguageResource>;
};

export type LanguageTranslationResources = {
  [language: string]: LanguageTranslationResource;
};
