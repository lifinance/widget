import type { i18n } from 'i18next'
import { createInstance } from 'i18next'
import { useMemo } from 'react'
import { I18nextProvider } from 'react-i18next'
import * as supportedLanguages from '../../i18n/index.js'
import { useSettings } from '../../stores/settings/useSettings.js'
import { compactNumberFormatter } from '../../utils/compactNumberFormatter.js'
import { currencyExtendedFormatter } from '../../utils/currencyExtendedFormatter.js'
import { deepMerge } from '../../utils/deepMerge.js'
import { getConfigItemSets, isItemAllowedForSets } from '../../utils/item.js'
import { percentFormatter } from '../../utils/percentFormatter.js'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import type { LanguageKey, LanguageTranslationResources } from './types.js'

export const I18nProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { languageResources, languages } = useWidgetConfig()
  const { language } = useSettings(['language'])

  const i18n = useMemo(() => {
    const languagesConfigSets = getConfigItemSets(
      languages,
      (languages) => new Set(languages)
    )
    let resources = (Object.keys(supportedLanguages) as LanguageKey[])
      .filter((lng) => isItemAllowedForSets(lng, languagesConfigSets))
      .reduce((resources, lng) => {
        resources[lng] = {
          translation: languageResources?.[lng]
            ? (deepMerge(
                // biome-ignore lint/performance/noDynamicNamespaceImportAccess: TODO: make it dynamic
                supportedLanguages[lng],
                languageResources[lng]
              ) as LanguageTranslationResources)
            : // biome-ignore lint/performance/noDynamicNamespaceImportAccess: TODO: make it dynamic
              supportedLanguages[lng],
        }
        return resources
      }, {} as LanguageTranslationResources)

    if (languageResources) {
      resources = Object.keys(languageResources).reduce((resources, lng) => {
        if (!resources[lng]) {
          resources[lng] = {
            translation: languageResources[lng as LanguageKey]!,
          }
        }
        return resources
      }, resources)
    }

    const i18n = createInstance({
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
    })

    i18n.init()

    i18n.services.formatter?.addCached('numberExt', compactNumberFormatter)
    i18n.services.formatter?.addCached('currencyExt', currencyExtendedFormatter)
    i18n.services.formatter?.addCached('percent', percentFormatter)

    return i18n
  }, [language, languageResources, languages])

  return <I18nextProvider i18n={i18n as i18n}>{children}</I18nextProvider>
}
