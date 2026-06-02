import type { FocusEventHandler, SyntheticEvent } from 'react'
import { useCallback } from 'react'
import { useFontLoader } from '../providers/FontLoaderProvider/FontLoaderProvider.js'
import { allFonts } from '../providers/FontLoaderProvider/fonts/defaultFonts.js'
import type { Font } from '../providers/FontLoaderProvider/types.js'
import { useEditToolsActions } from '../store/editTools/useEditToolsActions.js'
import { useSelectedFont } from '../store/editTools/useSelectedFont.js'
import { useConfigActions } from '../store/widgetConfig/useConfigActions.js'
import {
  cleanFontInput,
  createCustomFont,
  findFontByDisplayName,
  getFontFamilyCSSValue,
  sanitizeFontInput,
} from '../utils/font.js'

export const useFontSelection = (): {
  selectedFont: Font | undefined
  handleFontChange: (
    event: SyntheticEvent<Element, Event>,
    value: Font | string | null
  ) => void
  handleFontBlur: FocusEventHandler<HTMLInputElement>
} => {
  const { setFontFamily } = useConfigActions()
  const { setSelectedFont } = useEditToolsActions()
  const { selectedFont } = useSelectedFont()
  const { loadFont } = useFontLoader()

  const applyCustomFont = useCallback(
    (family: string): void => {
      setSelectedFont(createCustomFont(family))
      setFontFamily(family)
    },
    [setSelectedFont, setFontFamily]
  )

  const applyKnownFont = useCallback(
    async (font: Font): Promise<void> => {
      setSelectedFont(font)
      try {
        await loadFont(font)
      } catch (error) {
        console.warn('Failed to load font:', error)
      }
      setFontFamily(getFontFamilyCSSValue(font))
    },
    [setSelectedFont, loadFont, setFontFamily]
  )

  const handleFontChange = useCallback(
    (_: SyntheticEvent<Element, Event>, value: Font | string | null): void => {
      if (typeof value === 'string') {
        applyCustomFont(sanitizeFontInput(value))
      } else {
        void applyKnownFont(value ?? allFonts[0])
      }
    },
    [applyCustomFont, applyKnownFont]
  )

  const handleFontBlur = useCallback<FocusEventHandler<HTMLInputElement>>(
    (event) => {
      const inputValue = cleanFontInput(event.target.value)
      if (!selectedFont || inputValue !== getFontFamilyCSSValue(selectedFont)) {
        if (inputValue) {
          const matchingFont = findFontByDisplayName(inputValue)
          if (matchingFont) {
            void applyKnownFont(matchingFont)
          } else {
            applyCustomFont(inputValue)
          }
        }
      }
    },
    [selectedFont, applyKnownFont, applyCustomFont]
  )

  return {
    selectedFont,
    handleFontChange,
    handleFontBlur,
  }
}
