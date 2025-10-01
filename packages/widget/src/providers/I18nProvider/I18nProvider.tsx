import { createInstance } from 'i18next'
import { useEffect, useMemo } from 'react'
import { I18nextProvider } from 'react-i18next'
import { useSettings } from '../../stores/settings/useSettings.js'
import { useSettingsActions } from '../../stores/settings/useSettingsActions.js'
import { compactNumberFormatter } from '../../utils/compactNumberFormatter.js'
import { currencyExtendedFormatter } from '../../utils/currencyExtendedFormatter.js'
import { percentFormatter } from '../../utils/percentFormatter.js'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import { allLanguages } from './constants.js'
import { loadLocale } from './i18n.js'
import type { LanguageKey, LanguageResource, PartialResource } from './types.js'

export const I18nProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { languageResources } = useWidgetConfig()
  const {
    language,
    defaultLanguage,
    defaultLanguageCache,
    fallbackLanguage,
    fallbackLanguageCache,
  } = useSettings([
    'language',
    'defaultLanguage',
    'defaultLanguageCache',
    'fallbackLanguage',
    'fallbackLanguageCache',
  ])
  const { setValue } = useSettingsActions()

  const i18nInstance = useMemo(() => {
    // Custom language resources (of non-default languages) are added statically.
    // If custom language resources extend existing languages, they are merged with dynamically loaded resources.
    const customLanguageKeys = languageResources
      ? Object.keys(languageResources).filter(
          (key: string) => !allLanguages.includes(key as LanguageKey)
        )
      : []
    const i18n = createInstance({
      lng: defaultLanguage,
      fallbackLng: fallbackLanguage,
      lowerCaseLng: true,
      interpolation: { escapeValue: false },
      resources: {
        ...(defaultLanguage &&
          defaultLanguageCache && {
            [defaultLanguage as LanguageKey]: {
              translation: defaultLanguageCache,
            },
          }),
        ...(fallbackLanguage &&
          fallbackLanguageCache && {
            [fallbackLanguage as LanguageKey]: {
              translation: fallbackLanguageCache,
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

    return i18n
  }, [
    defaultLanguage,
    defaultLanguageCache,
    fallbackLanguage,
    fallbackLanguageCache,
    languageResources,
  ])

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
