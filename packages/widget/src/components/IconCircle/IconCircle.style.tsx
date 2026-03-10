import type { Theme } from '@mui/material'
import { Box, styled } from '@mui/material'

export const iconCircleSize = 90

interface StatusColorConfig {
  color: string
  alpha: number
  lightDarken: number
  darkDarken: number
}

export type StatusColor = 'success' | 'error' | 'warning' | 'info'

export const getStatusColor = (
  status: StatusColor,
  theme: Theme
): StatusColorConfig => {
  switch (status) {
    case 'success':
      return {
        color: theme.vars.palette.success.mainChannel,
        alpha: 0.12,
        lightDarken: 0,
        darkDarken: 0,
      }
    case 'error':
      return {
        color: theme.vars.palette.error.mainChannel,
        alpha: 0.12,
        lightDarken: 0,
        darkDarken: 0,
      }
    case 'warning':
      return {
        color: theme.vars.palette.warning.mainChannel,
        alpha: 0.48,
        lightDarken: 0.32,
        darkDarken: 0,
      }
    case 'info':
    default:
      return {
        color: theme.vars.palette.info.mainChannel,
        alpha: 0.12,
        lightDarken: 0,
        darkDarken: 0,
      }
  }
}

export const IconCircleRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'colorConfig',
})<{ colorConfig: StatusColorConfig }>(({ theme, colorConfig }) => ({
  backgroundColor: `rgba(${colorConfig.color} / ${colorConfig.alpha})`,
  borderRadius: '50%',
  width: iconCircleSize,
  height: iconCircleSize,
  display: 'grid',
  position: 'relative',
  placeItems: 'center',
  '& > svg': {
    color: `color-mix(in srgb, rgb(${colorConfig.color}) ${(1 - colorConfig.lightDarken) * 100}%, black)`,
    width: 48,
    height: 48,
  },
  ...theme.applyStyles('dark', {
    '& > svg': {
      color: `color-mix(in srgb, rgb(${colorConfig.color}) ${(1 - colorConfig.darkDarken) * 100}%, black)`,
      width: 48,
      height: 48,
    },
  }),
}))
