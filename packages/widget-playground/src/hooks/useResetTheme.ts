import { useCallback } from 'react'
import { allFonts } from '../providers/FontLoaderProvider/fonts/defaultFonts.js'
import { useEditToolsActions } from '../store/editTools/useEditToolsActions.js'
import { useConfigActions } from '../store/widgetConfig/useConfigActions.js'
import { useDefaultConfig } from '../store/widgetConfig/useDefaultConfig.js'

export const useResetTheme = (): (() => void) => {
  const { setConfigTheme } = useConfigActions()
  const { setSelectedFont, setViewportBackgroundColor } = useEditToolsActions()
  const { defaultConfig } = useDefaultConfig()

  return useCallback((): void => {
    const defaultTheme = defaultConfig?.theme ?? {}
    setConfigTheme(defaultTheme, 'default')
    setSelectedFont(allFonts[0])
    setViewportBackgroundColor(undefined, 'light')
    setViewportBackgroundColor(undefined, 'dark')
  }, [
    defaultConfig,
    setConfigTheme,
    setSelectedFont,
    setViewportBackgroundColor,
  ])
}
