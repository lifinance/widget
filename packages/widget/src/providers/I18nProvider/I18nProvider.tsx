import type { i18n } from 'i18next';
import { createInstance } from 'i18next';
import { useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';
import * as supportedLanguages from '../../i18n/index.js';
import { useSettings } from '../../stores/settings/useSettings.js';
import { deepMerge } from '../../utils/deepMerge.js';
import { isItemAllowed } from '../../utils/item.js';
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js';
import type { LanguageKey, LanguageTranslationResources } from './types.js';

export const I18nProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { languageResources, languages } = useWidgetConfig();
  const { language } = useSettings(['language']);

  const i18n = useMemo(() => {
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

    let i18n = createInstance({
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
      detection: {
        caches: [],
      },
      returnEmptyString: false,
    });

    i18n.init();

    return i18n;
  }, [language, languageResources, languages]);

  return <I18nextProvider i18n={i18n as i18n}>{children}</I18nextProvider>;
};
