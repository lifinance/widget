import type { Theme } from '@mui/material'
import { defaultMaxHeight } from '../config/constants'
import type { WidgetTheme } from '../types/widget'

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

export const getWidgetMaxWidth = (theme: Theme): string | number => {
  return theme.breakpoints.values.sm
}
