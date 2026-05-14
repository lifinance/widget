import { TextField } from '@mui/material'
import type { FocusEventHandler, JSX, SyntheticEvent } from 'react'
import { useCallback, useMemo } from 'react'
import { useFontLoader } from '../../providers/FontLoaderProvider/FontLoaderProvider.js'
import { allFonts } from '../../providers/FontLoaderProvider/fonts/defaultFonts.js'
import type { Font } from '../../providers/FontLoaderProvider/types.js'
import { useEditToolsStore } from '../../store/editTools/EditToolsProvider.js'
import { useEditToolsActions } from '../../store/editTools/useEditToolsActions.js'
import { useConfigActions } from '../../store/widgetConfig/useConfigActions.js'
import { FontPopper, StyledFontAutocomplete } from './FontAutocomplete.style.js'

export const FontAutocomplete = (): JSX.Element | null => {
  const { setFontFamily } = useConfigActions()
  const { setSelectedFont } = useEditToolsActions()
  const selectedFont = useEditToolsStore(
    (store) => store.fontControl.selectedFont
  )
  const { loadFont } = useFontLoader()

  const setAndLoadFont = useCallback(
    async (font: Font) => {
      setSelectedFont(font)
      await loadFont(font)
      setFontFamily(
        font.fallbackFonts
          ? `${font.family}, ${font.fallbackFonts}`
          : font.family
      )
    },
    [setSelectedFont, loadFont, setFontFamily]
  )

  const handleFontChange = useCallback(
    (_: SyntheticEvent<Element, Event>, value: Font | string | null) => {
      if (typeof value === 'string') {
        const cleanValue = value.replace(/['"`]/g, '')
        setSelectedFont({ family: cleanValue, source: 'Custom fonts' })
        setFontFamily(cleanValue)
      } else {
        setAndLoadFont(value ?? allFonts[0])
      }
    },
    [setAndLoadFont, setSelectedFont, setFontFamily]
  )

  const handleFontBlur: FocusEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const inputValue = event.target.value.replace(/['"`]/g, '').trim()
      const getFullName = (font: Font): string =>
        font.fallbackFonts
          ? `${font.family}, ${font.fallbackFonts}`
          : font.family

      if (!selectedFont || inputValue !== getFullName(selectedFont)) {
        if (inputValue) {
          const matchingFont = allFonts.find(
            (font) =>
              inputValue.toLowerCase() === getFullName(font).toLowerCase()
          )
          if (matchingFont) {
            setAndLoadFont(matchingFont)
          } else {
            setSelectedFont({ family: inputValue, source: 'Custom fonts' })
            setFontFamily(inputValue)
          }
        }
      }
    },
    [selectedFont, setAndLoadFont, setSelectedFont, setFontFamily]
  )

  const sortedFonts = useMemo(
    () =>
      [...allFonts].sort((a, b) => {
        let order = b.source.localeCompare(a.source)
        if (order === 0) {
          order = b.family.localeCompare(a.family)
        }
        return -order
      }) as Font[],
    []
  )

  if (!selectedFont) {
    return null
  }

  return (
    <StyledFontAutocomplete
      freeSolo
      slots={{ popper: FontPopper }}
      options={sortedFonts}
      groupBy={(font) => (font as Font).source}
      getOptionLabel={(font) => {
        if (typeof font === 'string') {
          return font
        }
        const f = font as Font
        return f.source === 'Custom fonts'
          ? f.family
          : f.fallbackFonts
            ? `${f.family}, ${f.fallbackFonts}`
            : f.family
      }}
      value={selectedFont}
      isOptionEqualToValue={(option, value) =>
        (option as Font).family ===
        (typeof value === 'string' ? value : (value as Font).family)
      }
      onChange={handleFontChange}
      onBlur={handleFontBlur}
      renderInput={(params) => (
        <TextField {...params} aria-label="font selection" />
      )}
    />
  )
}
