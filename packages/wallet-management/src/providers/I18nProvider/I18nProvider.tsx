import type { i18n } from 'i18next';
import { createInstance } from 'i18next';
import type { PropsWithChildren } from 'react';
import { useEffect, useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';
import * as supportedLanguages from '../../i18n/index.js';
import type { LanguageKey, LanguageTranslationResources } from './types.js';

interface I18nProviderProps {
  locale?: LanguageKey;
}

export const I18nProvider: React.FC<PropsWithChildren<I18nProviderProps>> = ({
  children,
  locale,
}) => {
  const i18n = useMemo(() => {
    let resources = (Object.keys(supportedLanguages) as LanguageKey[]).reduce(
      (resources, lng) => {
        resources[lng] = {
          translation: supportedLanguages[lng],
        };
        return resources;
      },
      {} as LanguageTranslationResources,
    );

    let i18n = createInstance({
      lng: locale || 'en',
      fallbackLng: resources.en ? 'en' : Object.keys(resources)?.[0],
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
  }, [locale]);

  useEffect(() => {
    if (locale && locale !== i18n.language) {
      i18n.changeLanguage(locale);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  return <I18nextProvider i18n={i18n as i18n}>{children}</I18nextProvider>;
};
