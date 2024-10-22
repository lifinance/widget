import { shallow } from 'zustand/shallow'
import { useWidgetConfigStore } from './WidgetConfigProvider'

export const useThemeValues = () => {
  const [selectedThemeId, allThemesItems] = useWidgetConfigStore(
    (store) => [store.themeId, store.widgetThemeItems],
    shallow
  )

  return {
    selectedThemeId,
    selectedThemeItem: allThemesItems.find(
      (themeItem) => themeItem.id === selectedThemeId
    ),
    allThemesItems,
  }
}
