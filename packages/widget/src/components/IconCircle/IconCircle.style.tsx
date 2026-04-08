import type { Theme } from '@mui/material'
import { Box, styled } from '@mui/material'
import type React from 'react'
import type { StatusIcon } from './statusIcons'

export const iconCircleSize = 90

interface StatusColorConfig {
  color: string
  mixAmount: number
  lightDarken: number
  darkDarken: number
}

export const getStatusColor = (
  status: StatusIcon,
  theme: Theme
): StatusColorConfig => {
  switch (status) {
    case 'success':
      return {
        color: theme.vars.palette.success.mainChannel,
        mixAmount: 12,
        lightDarken: 0,
        darkDarken: 0,
      }
    case 'error':
      return {
        color: theme.vars.palette.error.mainChannel,
        mixAmount: 12,
        lightDarken: 0,
        darkDarken: 0,
      }
    case 'warning':
      return {
        color: theme.vars.palette.warning.mainChannel,
        mixAmount: 48,
        lightDarken: 0.32,
        darkDarken: 0,
      }
    case 'info':
      return {
        color: theme.vars.palette.info.mainChannel,
        mixAmount: 12,
        lightDarken: 0,
        darkDarken: 0,
      }
  }
}

export const iconSizeRatio: number = 48 / 90

export const IconCircleRoot: React.FC<
  React.ComponentProps<typeof Box> & {
    colorConfig: StatusColorConfig
    circleSize: number
  }
> = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'colorConfig' && prop !== 'circleSize',
})<{ colorConfig: StatusColorConfig; circleSize: number }>(
  ({ theme, colorConfig, circleSize }) => {
    const svgSize = Math.round(circleSize * iconSizeRatio)
    return {
      backgroundColor: `color-mix(in srgb, rgb(${colorConfig.color}) ${colorConfig.mixAmount}%, ${theme.vars.palette.background.paper})`,
      borderRadius: '50%',
      width: circleSize,
      height: circleSize,
      display: 'grid',
      position: 'relative',
      placeItems: 'center',
      '& > svg': {
        color: `color-mix(in srgb, rgb(${colorConfig.color}) ${(1 - colorConfig.lightDarken) * 100}%, black)`,
        width: svgSize,
        height: svgSize,
      },
      ...theme.applyStyles('dark', {
        '& > svg': {
          color: `color-mix(in srgb, rgb(${colorConfig.color}) ${(1 - colorConfig.darkDarken) * 100}%, black)`,
          width: svgSize,
          height: svgSize,
        },
      }),
    }
  }
)
