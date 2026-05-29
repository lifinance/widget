import { useCallback } from 'react'
import { allFonts } from '../providers/FontLoaderProvider/fonts/defaultFonts.js'
import { useEditToolsActions } from '../store/editTools/useEditToolsActions.js'
import { useConfigActions } from '../store/widgetConfig/useConfigActions.js'
import { useThemeValues } from '../store/widgetConfig/useThemeValues.js'

export const useResetTheme = (): (() => void) => {
  const { setConfigTheme, getCurrentThemePreset } = useConfigActions()
  const { setSelectedFont, setViewportBackgroundColor } = useEditToolsActions()
  const { selectedThemeId } = useThemeValues()

  return useCallback((): void => {
    const presetTheme = getCurrentThemePreset() ?? {}
    setConfigTheme(presetTheme, selectedThemeId)
    setSelectedFont(allFonts[0])

    const lightPlayground =
      presetTheme.colorSchemes?.light?.palette?.playground?.main
    const darkPlayground =
      presetTheme.colorSchemes?.dark?.palette?.playground?.main
    setViewportBackgroundColor(lightPlayground, 'light')
    setViewportBackgroundColor(darkPlayground, 'dark')
  }, [
    getCurrentThemePreset,
    selectedThemeId,
    setConfigTheme,
    setSelectedFont,
    setViewportBackgroundColor,
  ])
}
