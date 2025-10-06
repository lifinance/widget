import { createInstance, type i18n } from 'i18next'
import { useMemo, useRef } from 'react'
import { I18nextProvider } from 'react-i18next'
import { useSettings } from '../../stores/settings/useSettings.js'
import { compactNumberFormatter } from '../../utils/compactNumberFormatter.js'
import { currencyExtendedFormatter } from '../../utils/currencyExtendedFormatter.js'
import { percentFormatter } from '../../utils/percentFormatter.js'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import { allLanguages } from './constants.js'
import { enResource } from './enResource.js'
import { mergeWithLanguageResources } from './i18n.js'
import type { LanguageKey, LanguageResource, PartialResource } from './types.js'

export const I18nProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { languages, languageResources } = useWidgetConfig()
  const { language, languageCache } = useSettings(['language', 'languageCache'])
  const i18nInstanceRef = useRef<i18n | null>(null)

  const i18nInstance = useMemo(() => {
    if (i18nInstanceRef.current) {
      // Update i18n instance with language and language cache updates
      if (language && languageCache && language !== 'en') {
        i18nInstanceRef.current.addResourceBundle(
          language,
          'translation',
          languageCache,
          true,
          true
        )
      }
      return i18nInstanceRef.current
    }

    // Custom language resources (of non-default languages) are added statically.
    // If custom language resources extend existing languages, they are merged with dynamically loaded resources.
    const customLanguageKeys = languageResources
      ? Object.keys(languageResources).filter(
          (key: string) => !allLanguages.includes(key as LanguageKey)
        )
      : []
    const initialLanguage = language || languages?.default
    const i18n = createInstance({
      lng: initialLanguage,
      fallbackLng: 'en',
      lowerCaseLng: true,
      interpolation: { escapeValue: false },
      resources: {
        en: {
          translation: mergeWithLanguageResources(
            enResource,
            languageResources?.en
          ),
        },
        ...(initialLanguage &&
          initialLanguage !== 'en' &&
          languageCache && {
            [initialLanguage]: {
              translation: languageCache,
            },
          }),
        // Add non-existing custom language resources
        ...customLanguageKeys.reduce(
          (acc, key) => {
            const customResource = languageResources?.[key as LanguageKey]
            if (customResource) {
              acc[key] = {
                translation: customResource,
              }
            }
            return acc
          },
          {} as Record<
            string,
            { translation: PartialResource<LanguageResource> }
          >
        ),
      },
      detection: {
        caches: [],
      },
      returnEmptyString: false,
    })

    i18n.init()

    i18n.services.formatter?.addCached('numberExt', compactNumberFormatter)
    i18n.services.formatter?.addCached('currencyExt', currencyExtendedFormatter)
    i18n.services.formatter?.addCached('percent', percentFormatter)
    i18nInstanceRef.current = i18n
    return i18n
  }, [language, languageResources, languages?.default, languageCache])

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
}
