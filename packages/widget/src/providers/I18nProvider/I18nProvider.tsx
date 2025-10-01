import { createInstance, type i18n } from 'i18next'
import { useEffect, useMemo, useRef } from 'react'
import { I18nextProvider } from 'react-i18next'
import { useSettings } from '../../stores/settings/useSettings.js'
import { useSettingsActions } from '../../stores/settings/useSettingsActions.js'
import { compactNumberFormatter } from '../../utils/compactNumberFormatter.js'
import { currencyExtendedFormatter } from '../../utils/currencyExtendedFormatter.js'
import { percentFormatter } from '../../utils/percentFormatter.js'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import { allLanguages } from './constants.js'
import { enResource } from './enResource.js'
import { loadLocale, mergeWithLanguageResources } from './i18n.js'
import type { LanguageKey, LanguageResource, PartialResource } from './types.js'

export const I18nProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { languages, languageResources } = useWidgetConfig()
  const { language, languageCache } = useSettings(['language', 'languageCache'])
  const { setValue } = useSettingsActions()

  const i18nInstanceRef = useRef<i18n | null>(null)
  const i18nInstance = useMemo(() => {
    if (i18nInstanceRef.current) {
      return i18nInstanceRef.current
    }

    // Custom language resources (of non-default languages) are added statically.
    // If custom language resources extend existing languages, they are merged with dynamically loaded resources.
    const customLanguageKeys = languageResources
      ? Object.keys(languageResources).filter(
          (key: string) => !allLanguages.includes(key as LanguageKey)
        )
      : []
    const i18n = createInstance({
      lng: language || languages?.default,
      fallbackLng: 'en',
      lowerCaseLng: true,
      interpolation: { escapeValue: false },
      resources: {
        ...(language &&
          language !== 'en' &&
          languageCache && {
            [language as LanguageKey]: {
              translation: languageCache,
            },
          }),
        en: {
          translation: mergeWithLanguageResources(
            enResource,
            languageResources?.en
          ),
        },
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

  useEffect(() => {
    const handleLanguageChange = async () => {
      const locale = language as LanguageKey
      if (!i18nInstance.hasResourceBundle(locale, 'translation')) {
        await loadLocale(locale, languageResources?.[locale]).then(
          (languageResource) => {
            i18nInstance.addResourceBundle(
              locale,
              'translation',
              languageResource,
              true,
              true
            )
            // Cache the language resource to prevent blinking
            // after switching languages and reloading the page
            setValue('languageCache', languageResource)
          }
        )
      } else {
        // If the language is already loaded, just cache the existing resource
        const currentResource = i18nInstance.getResourceBundle(
          locale,
          'translation'
        )
        setValue('languageCache', currentResource)
      }
      if (locale !== i18nInstance.language) {
        await i18nInstance.changeLanguage(locale)
      }
    }

    if (language) {
      handleLanguageChange()
    }
  }, [language, languageResources, i18nInstance, setValue])

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
}
