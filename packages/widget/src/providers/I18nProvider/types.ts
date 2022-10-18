import type * as languages from '../../i18n';

export interface I18nContextProps {
  changeLanguage(lng?: string): void;
  languageResources: LanguageTranslationResources;
}

export type PartialResource<T> = T extends object
  ? {
      [P in keyof T]?: PartialResource<T[P]>;
    }
  : T;

export type LanguageKey = keyof typeof languages;

export type LanguageResources =
  | {
      [language in LanguageKey]?: PartialResource<typeof languages.en>;
    }
  | {
      [language: string]: PartialResource<typeof languages.en>;
    };

export type LanguageTranslationResource = {
  [namespace in 'translation']: PartialResource<typeof languages.en>;
};

export type LanguageTranslationResources = {
  [language: string]: LanguageTranslationResource;
};
