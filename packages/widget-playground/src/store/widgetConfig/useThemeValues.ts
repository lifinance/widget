import { useWidgetConfigStore } from './WidgetConfigProvider'

export const useThemeValues = () => {
  const [selectedThemeId, allThemesItems] = useWidgetConfigStore((store) => [
    store.themeId,
    store.widgetThemeItems,
  ])

  return {
    selectedThemeId,
    selectedThemeItem: allThemesItems.find(
      (themeItem) => themeItem.id === selectedThemeId
    ),
    allThemesItems,
  }
}
