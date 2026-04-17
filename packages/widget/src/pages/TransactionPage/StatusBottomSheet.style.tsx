import type { Theme } from '@mui/material'
import { Box, styled } from '@mui/material'
import type React from 'react'
import { RouteExecutionStatus } from '../../stores/routes/types.js'

type StatusColor = RouteExecutionStatus | 'warning'

const getStatusColor = (status: StatusColor, theme: Theme) => {
  switch (status) {
    case RouteExecutionStatus.Done:
      return {
        color: theme.vars.palette.success.main,
        alpha: 0.12,
        lightDarken: 0,
        darkDarken: 0,
      }
    case RouteExecutionStatus.Failed:
      return {
        color: theme.vars.palette.error.main,
        alpha: 0.12,
        lightDarken: 0,
        darkDarken: 0,
      }
    case RouteExecutionStatus.Done | RouteExecutionStatus.Partial:
    case RouteExecutionStatus.Done | RouteExecutionStatus.Refunded:
    case 'warning':
      return {
        color: theme.vars.palette.warning.main,
        alpha: 0.48,
        lightDarken: 0.32,
        darkDarken: 0,
      }
    default:
      return {
        color: theme.vars.palette.primary.main,
        alpha: 0.12,
        lightDarken: 0,
        darkDarken: 0,
      }
  }
}

export const CenterContainer: React.FC<
  React.ComponentProps<typeof Box> & { status?: StatusColor }
> = styled(Box)(() => ({
  display: 'grid',
  placeItems: 'center',
  position: 'relative',
}))

export const IconCircle: React.FC<
  React.ComponentProps<typeof Box> & { status?: StatusColor }
> = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status?: StatusColor }>(
  ({ theme, status = RouteExecutionStatus.Idle }) => {
    const statusConfig = getStatusColor(status, theme)

    return {
      backgroundColor: `color-mix(in srgb, ${statusConfig.color} ${statusConfig.alpha * 100}%, transparent)`,
      borderRadius: '50%',
      width: 72,
      height: 72,
      display: 'grid',
      position: 'relative',
      placeItems: 'center',
      '& > svg': {
        color: `color-mix(in srgb, ${statusConfig.color} ${(1 - statusConfig.lightDarken) * 100}%, black)`,
        width: 36,
        height: 36,
      },
      ...theme.applyStyles('dark', {
        '& > svg': {
          color: `color-mix(in srgb, ${statusConfig.color} ${(1 - statusConfig.darkDarken) * 100}%, black)`,
          width: 36,
          height: 36,
        },
      }),
    }
  }
)
