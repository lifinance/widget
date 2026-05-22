import { allFonts } from '../providers/FontLoaderProvider/fonts/defaultFonts.js'
import type { Font } from '../providers/FontLoaderProvider/types.js'

export const getFontFamilyCSSValue = (font: Font): string =>
  font.fallbackFonts ? `${font.family}, ${font.fallbackFonts}` : font.family

export const getFontOptionLabel = (font: Font): string =>
  font.source === 'Custom fonts' ? font.family : getFontFamilyCSSValue(font)

export const getFontAutocompleteOptionLabel = (font: Font | string): string =>
  typeof font === 'string' ? font : getFontOptionLabel(font)

export const sanitizeFontInput = (value: string): string =>
  value.replace(/['"`]/g, '')

export const cleanFontInput = (value: string): string =>
  sanitizeFontInput(value).trim()

export const createCustomFont = (family: string): Font => ({
  family,
  source: 'Custom fonts',
})

export const findFontByDisplayName = (input: string): Font | undefined =>
  allFonts.find(
    (font) => input.toLowerCase() === getFontFamilyCSSValue(font).toLowerCase()
  )

export const sortedFonts: Font[] = [...allFonts].sort((a, b) => {
  let order = b.source.localeCompare(a.source)
  if (order === 0) {
    order = b.family.localeCompare(a.family)
  }
  return -order
})

export const groupFontBySource = (font: Font | string): string =>
  typeof font === 'string' ? 'Custom fonts' : font.source

export const isFontAutocompleteOptionEqual = (
  option: Font | string,
  value: Font | string
): boolean => {
  const optionFamily = typeof option === 'string' ? option : option.family
  const valueFamily = typeof value === 'string' ? value : value.family
  return optionFamily === valueFamily
}
