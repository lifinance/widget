import type { SyntheticEvent } from 'react'
import { useCallback, useState } from 'react'
import { useEditToolsActions } from '../store/editTools/useEditToolsActions.js'
import { usePlaygroundSettingValues } from '../store/editTools/usePlaygroundSettingValues.js'
import { useConfigActions } from '../store/widgetConfig/useConfigActions.js'
import { useThemeValues } from '../store/widgetConfig/useThemeValues.js'
import {
  getEffectivePaletteMode,
  getInitialPaletteMode,
  getPaletteColorPath,
  getThemeSchemeSupport,
  getThemeViewportBackground,
  getViewportBackgroundHex,
  type PaletteMode,
} from '../utils/themeEdit.js'
import { useThemeMode } from './useThemeMode.js'

export const useThemeEditPalette = (): {
  effectivePaletteMode: PaletteMode
  hasBothModes: boolean
  handlePaletteModeChange: (_: SyntheticEvent, value: PaletteMode) => void
  colorPath: (suffix: string) => string
  viewportBackgroundHex: string
  onViewportBackgroundChange: (newHex: string) => void
} => {
  const { setAppearance } = useConfigActions()
  const { setViewportBackgroundColor } = useEditToolsActions()
  const { viewportColorLight, viewportColorDark } = usePlaygroundSettingValues()
  const { themeMode, setMode } = useThemeMode()
  const { selectedThemeItem } = useThemeValues()

  const { canLight, canDark, hasBothModes } = getThemeSchemeSupport(
    selectedThemeItem?.theme.colorSchemes
  )

  const [paletteMode, setPaletteMode] = useState<PaletteMode>(() =>
    getInitialPaletteMode(canLight, canDark, themeMode)
  )

  const effectivePaletteMode = getEffectivePaletteMode(
    paletteMode,
    canLight,
    canDark
  )

  const handlePaletteModeChange = useCallback(
    (_: SyntheticEvent, value: PaletteMode): void => {
      setPaletteMode(value)
      setAppearance(value)
      setMode(value)
      setViewportBackgroundColor(
        getThemeViewportBackground(value, selectedThemeItem),
        value
      )
    },
    [setAppearance, setMode, setViewportBackgroundColor, selectedThemeItem]
  )

  const colorPath = useCallback(
    (suffix: string): string =>
      getPaletteColorPath(effectivePaletteMode, suffix),
    [effectivePaletteMode]
  )

  const viewportBackgroundHex = getViewportBackgroundHex(
    effectivePaletteMode,
    viewportColorLight,
    viewportColorDark
  )

  const onViewportBackgroundChange = useCallback(
    (newHex: string): void => {
      setViewportBackgroundColor(newHex, effectivePaletteMode)
    },
    [effectivePaletteMode, setViewportBackgroundColor]
  )

  return {
    effectivePaletteMode,
    hasBothModes,
    handlePaletteModeChange,
    colorPath,
    viewportBackgroundHex,
    onViewportBackgroundChange,
  }
}
