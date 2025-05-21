import type { Theme } from '@mui/material'
import { Box, styled } from '@mui/material'
import { RouteExecutionStatus } from '../../stores/routes/types.js'

type StatusColor = RouteExecutionStatus | 'warning'

const getStatusColor = (status: StatusColor, theme: Theme) => {
  switch (status) {
    case RouteExecutionStatus.Done:
      return {
        color: theme.vars.palette.success.mainChannel,
        alpha: 0.12,
        darken: 0,
      }
    case RouteExecutionStatus.Failed:
      return {
        color: theme.vars.palette.error.mainChannel,
        alpha: 0.12,
        darken: 0,
      }
    case RouteExecutionStatus.Done | RouteExecutionStatus.Partial:
    case RouteExecutionStatus.Done | RouteExecutionStatus.Refunded:
    case 'warning':
      return {
        color: theme.vars.palette.warning.mainChannel,
        alpha: 0.48,
        darken: theme.palette.mode === 'light' ? 0.32 : 0,
      }
    default:
      return {
        color: theme.vars.palette.primary.mainChannel,
        alpha: 0.12,
        darken: 0,
      }
  }
}

export const CenterContainer = styled(Box)(() => ({
  display: 'grid',
  placeItems: 'center',
  position: 'relative',
}))

export const IconCircle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status: StatusColor }>(({ theme, status }) => {
  const {
    color,
    alpha: alphaValue,
    darken: darkenValue,
  } = getStatusColor(status, theme)
  return {
    backgroundColor: `rgba(${color} / ${alphaValue})`,
    borderRadius: '50%',
    width: 64,
    height: 64,
    display: 'grid',
    position: 'relative',
    placeItems: 'center',
    '& > svg': {
      color: `color-mix(in srgb, rgb(${color}) ${(1 - darkenValue) * 100}%, black)`,
      width: 32,
      height: 32,
    },
  }
})
