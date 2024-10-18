import InfoIcon from '@mui/icons-material/Info'
import { CircularProgress, TextField } from '@mui/material'
import type { FocusEventHandler, SyntheticEvent } from 'react'
import { useCallback } from 'react'
import { useFontLoader } from '../../../../providers/FontLoaderProvider/FontLoaderProvider'
import type { Font } from '../../../../providers/FontLoaderProvider/types'
import { useEditToolsActions } from '../../../../store/editTools/useEditToolsActions'
import { useFontToolValues } from '../../../../store/editTools/useFontToolValues'
import { useConfigActions } from '../../../../store/widgetConfig/useConfigActions'
import { ExpandableCard } from '../../../Card/ExpandableCard'
import { Alert, Autocomplete, StyledPopper } from '../DesignControls.style'
import { allFonts, defaultFont } from './defaultFonts'

const sanitiseInputString = (value: string) => value.replace(/['"`]/g, '')

const getCompleteFontFamily = (font: Font) =>
  font.fallbackFonts
    ? [font.family, font.fallbackFonts].join(', ')
    : font.family
export const FontsControl = () => {
  const { setFontFamily } = useConfigActions()
  const { selectedFont } = useFontToolValues()
  const { setSelectedFont } = useEditToolsActions()

  const { loadFont, isLoadingFont } = useFontLoader()
  const setAndLoadFont = useCallback(
    async (font: Font) => {
      setSelectedFont(font)
      await loadFont(font)
      setFontFamily(getCompleteFontFamily(font))
    },
    [setSelectedFont, loadFont, setFontFamily]
  )

  const handleAutocompleteChange = (
    _: SyntheticEvent<Element, Event>,
    value: Font | string | null
  ) => {
    if (typeof value === 'string') {
      const cleanValue = sanitiseInputString(value)
      setSelectedFont({ family: cleanValue, source: 'Custom fonts' })
      setFontFamily(cleanValue)
    } else {
      const font = value ? value : defaultFont
      setAndLoadFont(font)
    }
  }

  const handleAutocompleteBlur: FocusEventHandler<HTMLInputElement> = (
    event
  ) => {
    const inputValue = sanitiseInputString(event.target.value.trim())

    if (!selectedFont || inputValue !== getCompleteFontFamily(selectedFont)) {
      if (inputValue) {
        const matchingFont = allFonts.find(
          (font) =>
            inputValue.toLowerCase() ===
            getCompleteFontFamily(font).toLowerCase()
        )
        if (matchingFont) {
          setAndLoadFont(matchingFont)
        } else {
          setSelectedFont({ family: inputValue, source: 'Custom fonts' })
          setFontFamily(inputValue)
        }
      }
    }
  }

  const FontInfoMessage =
    selectedFont?.source === 'System fonts'
      ? 'System font should be supported by the intended OS'
      : selectedFont?.source === 'Custom fonts'
        ? 'Fonts should be loaded separately'
        : selectedFont?.source === 'Google fonts' &&
            selectedFont?.family !== defaultFont.family
          ? 'Fonts should be loaded from Google Fonts separately'
          : 'Fonts should be loaded separately or be supported by OS'

  return (
    <ExpandableCard
      title={
        <>
          Font
          {isLoadingFont && (
            <CircularProgress size="1rem" sx={{ marginLeft: 1 }} />
          )}
        </>
      }
      value={selectedFont?.family}
    >
      {selectedFont && (
        <Autocomplete
          freeSolo
          sx={{ mt: 1 }}
          PopperComponent={StyledPopper}
          options={
            allFonts.sort((a, b) => {
              let order = b.source.localeCompare(a.source)
              if (order === 0) {
                order = b.family.localeCompare(a.family)
              }
              return -order
            }) as Font[]
          }
          groupBy={(font) => font.source}
          getOptionLabel={(font) => {
            if (typeof font === 'string') {
              return font
            }
            return font.source === 'Custom fonts'
              ? font.family
              : getCompleteFontFamily(font)
          }}
          value={selectedFont}
          isOptionEqualToValue={(option, value) =>
            option.family === value.family
          }
          onChange={handleAutocompleteChange}
          onBlur={handleAutocompleteBlur}
          renderInput={(params) => (
            <TextField {...params} aria-label="font selection" />
          )}
        />
      )}
      <Alert
        icon={<InfoIcon fontSize="inherit" />}
        severity="info"
        sx={{ mt: 1 }}
      >
        {FontInfoMessage}
      </Alert>
    </ExpandableCard>
  )
}
