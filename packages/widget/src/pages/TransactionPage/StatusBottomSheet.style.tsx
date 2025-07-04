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
        lightDarken: 0,
        darkDarken: 0,
      }
    case RouteExecutionStatus.Failed:
      return {
        color: theme.vars.palette.error.mainChannel,
        alpha: 0.12,
        lightDarken: 0,
        darkDarken: 0,
      }
    case RouteExecutionStatus.Done | RouteExecutionStatus.Partial:
    case RouteExecutionStatus.Done | RouteExecutionStatus.Refunded:
    case 'warning':
      return {
        color: theme.vars.palette.warning.mainChannel,
        alpha: 0.48,
        lightDarken: 0.32,
        darkDarken: 0,
      }
    default:
      return {
        color: theme.vars.palette.primary.mainChannel,
        alpha: 0.12,
        lightDarken: 0,
        darkDarken: 0,
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
  const statusConfig = getStatusColor(status, theme)

  return {
    backgroundColor: `rgba(${statusConfig.color} / ${statusConfig.alpha})`,
    borderRadius: '50%',
    width: 72,
    height: 72,
    display: 'grid',
    position: 'relative',
    placeItems: 'center',
    '& > svg': {
      color: `color-mix(in srgb, rgb(${statusConfig.color}) ${(1 - statusConfig.lightDarken) * 100}%, black)`,
      width: 36,
      height: 36,
    },
    ...theme.applyStyles('dark', {
      '& > svg': {
        color: `color-mix(in srgb, rgb(${statusConfig.color}) ${(1 - statusConfig.darkDarken) * 100}%, black)`,
        width: 36,
        height: 36,
      },
    }),
  }
})
