import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { createContext, useContext, useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';
import * as supportedLanguages from '../../i18n';
import { useSettings } from '../../stores';
import { deepMerge } from '../../utils';
import { isItemAllowed, useWidgetConfig } from '../WidgetProvider';
import type {
  I18nContextProps,
  LanguageKey,
  LanguageTranslationResources,
} from './types';

const I18nContext = createContext<I18nContextProps>(null!);

export const useI18n = (): I18nContextProps => useContext(I18nContext);

export const I18nProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { languageResources, languages, disableI18n } = useWidgetConfig();
  const { language } = useSettings(['language']);

  const { i18n, ...value } = useMemo(() => {
    let i18n = i18next;
    if (!language && !languages?.default && !disableI18n) {
      i18n = i18n.use(LanguageDetector);
    }

    let resources = (Object.keys(supportedLanguages) as LanguageKey[])
      .filter((lng) => isItemAllowed(lng, languages))
      .reduce((resources, lng) => {
        resources[lng] = {
          translation: languageResources?.[lng]
            ? (deepMerge(
                supportedLanguages[lng],
                languageResources[lng],
              ) as any)
            : supportedLanguages[lng],
        };
        return resources;
      }, {} as LanguageTranslationResources);

    if (languageResources) {
      resources = Object.keys(languageResources).reduce((resources, lng) => {
        if (!resources[lng]) {
          resources[lng] = {
            translation: languageResources[lng as LanguageKey]!,
          };
        }
        return resources;
      }, resources);
    }

    i18n = i18n.createInstance(
      {
        lng: languages?.default || language,
        fallbackLng: resources.en
          ? 'en'
          : languages?.default ||
            languages?.allow?.[0] ||
            Object.keys(resources)?.[0],
        lowerCaseLng: true,
        interpolation: {
          escapeValue: false,
        },
        resources,
      },
      // providing an empty callback here will automatically call init
      () => {},
    );

    return {
      i18n,
      changeLanguage: (lng?: string) => {
        i18n.changeLanguage(lng);
      },
      languageResources: resources,
    };
  }, [disableI18n, language, languageResources, languages]);

  return (
    <I18nextProvider i18n={i18n}>
      <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
    </I18nextProvider>
  );
};
