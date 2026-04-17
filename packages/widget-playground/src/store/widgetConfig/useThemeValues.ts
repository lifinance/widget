import type { ThemeItem } from '../editTools/types.js'
import { useWidgetConfigStore } from './WidgetConfigProvider.js'

export const useThemeValues = (): {
  selectedThemeId: string
  selectedThemeItem: ThemeItem | undefined
  allThemesItems: ThemeItem[]
} => {
  const [selectedThemeId, allThemesItems] = useWidgetConfigStore((store) => [
    store.themeId,
    store.widgetThemeItems,
  ])

  return {
    selectedThemeId: selectedThemeId,
    selectedThemeItem: allThemesItems.find(
      (themeItem) => themeItem.id === selectedThemeId
    ),
    allThemesItems: allThemesItems,
  }
}
