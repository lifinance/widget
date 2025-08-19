import type { Font } from '../../../../providers/FontLoaderProvider/types.js'
import { googleFonts } from './googleFonts.js'
import { systemFonts } from './systemFonts.js'

// NOTE: although this is a google font, as the widget playground itself is using Inter we don't
//  need to download the font files as they should already be downloaded - thus no fontFiles are defined
export const defaultFont: Font = {
  family: 'Inter',
  fallbackFonts: 'sans-serif',
  source: 'Google fonts',
}

export const allFonts: Font[] = [
  { ...defaultFont },
  ...systemFonts,
  ...googleFonts,
]
