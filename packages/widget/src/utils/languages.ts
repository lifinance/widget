import { allLanguages } from '../pages/LanguagesPage/constants.js'
import type { WidgetLanguages } from '../types/widget.js'
import { getConfigItemSets, isItemAllowedForSets } from './item.js'

export const getSupportedLanguages = (languagesConfig?: WidgetLanguages) => {
  if (!languagesConfig) {
    return allLanguages
  }

  const languagesConfigSets = getConfigItemSets(
    languagesConfig,
    (languages) => new Set(languages)
  )

  return allLanguages.filter((language) =>
    isItemAllowedForSets(language, languagesConfigSets)
  )
}
