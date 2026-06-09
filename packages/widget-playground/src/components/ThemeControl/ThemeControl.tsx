import type { JSX } from 'react'
import { useCallback } from 'react'
import { useThemeMode } from '../../hooks/useThemeMode.js'
import type { ThemeItem } from '../../store/editTools/types.js'
import { useEditToolsActions } from '../../store/editTools/useEditToolsActions.js'
import { useConfigActions } from '../../store/widgetConfig/useConfigActions.js'
import { useThemeValues } from '../../store/widgetConfig/useThemeValues.js'
import { ThemeCardItem } from './ThemeCardItem.js'
import { ThemeCardsContainer } from './ThemeControl.style.js'

interface ThemeControlContainerProps {
  onOpenEditTheme?: () => void
}

export const ThemeControl = ({
  onOpenEditTheme,
}: ThemeControlContainerProps): JSX.Element => {
  const { setConfigTheme, setAppearance } = useConfigActions()
  const { themeMode, setMode } = useThemeMode()
  const { selectedThemeId, allThemesItems } = useThemeValues()
  const { setViewportBackgroundColor } = useEditToolsActions()

  const handleSelectTheme = useCallback(
    (themeItem: ThemeItem): void => {
      const nextThemeMode =
        themeItem.theme.colorSchemes?.[themeMode] !== undefined
          ? themeMode
          : themeItem.theme.colorSchemes?.light
            ? 'light'
            : themeItem.theme.colorSchemes?.dark
              ? 'dark'
              : undefined

      setConfigTheme(themeItem.theme, themeItem.id)
      if (nextThemeMode && nextThemeMode !== themeMode) {
        setAppearance(nextThemeMode)
        setMode(nextThemeMode)
      }
      setViewportBackgroundColor(
        themeItem.theme.colorSchemes?.light?.palette?.playground?.main,
        'light'
      )
      setViewportBackgroundColor(
        themeItem.theme.colorSchemes?.dark?.palette?.playground?.main,
        'dark'
      )
    },
    [
      themeMode,
      setConfigTheme,
      setAppearance,
      setMode,
      setViewportBackgroundColor,
    ]
  )

  return (
    <ThemeCardsContainer>
      {allThemesItems.map((themeItem) => (
        <ThemeCardItem
          key={themeItem.id}
          themeItem={themeItem}
          isSelected={selectedThemeId === themeItem.id}
          onSelect={handleSelectTheme}
          onOpenEditTheme={onOpenEditTheme}
        />
      ))}
    </ThemeCardsContainer>
  )
}
