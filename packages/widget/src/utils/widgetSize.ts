import type { Theme } from '@mui/material'
import { defaultMaxHeight } from '../config/constants.js'
import type { WidgetTheme } from '../types/widget.js'

export const getWidgetMaxHeight = (
  theme: Theme | WidgetTheme | undefined
): number | string => {
  if (theme?.container?.maxHeight) {
    return theme?.container?.maxHeight
  }

  if (theme?.container?.height && theme?.container?.height !== 'fit-content') {
    return theme?.container?.height
  }

  return defaultMaxHeight
}
