import type { Theme } from '@mui/material'
import { Box, alpha, darken, styled } from '@mui/material'
import { RouteExecutionStatus } from '../../stores/routes/types.js'

type StatusColor = RouteExecutionStatus | 'warning'

const getStatusColor = (status: StatusColor, theme: Theme) => {
  switch (status) {
    case RouteExecutionStatus.Done:
      return { color: theme.palette.success.main, alpha: 0.12, darken: 0 }
    case RouteExecutionStatus.Failed:
      return { color: theme.palette.error.main, alpha: 0.12, darken: 0 }
    case RouteExecutionStatus.Done | RouteExecutionStatus.Partial:
    case RouteExecutionStatus.Done | RouteExecutionStatus.Refunded:
    case 'warning':
      return {
        color: theme.palette.warning.main,
        alpha: 0.48,
        darken: theme.palette.mode === 'light' ? 0.32 : 0,
      }
    default:
      return { color: theme.palette.primary.main, alpha: 0.12, darken: 0 }
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
    backgroundColor: alpha(color, alphaValue),
    borderRadius: '50%',
    width: 64,
    height: 64,
    display: 'grid',
    position: 'relative',
    placeItems: 'center',
    '& > svg': {
      color: darken(color, darkenValue),
      width: 32,
      height: 32,
    },
  }
})

export const MessageSkeletonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: 64,
  gap: theme.spacing(0.5),
  paddingTop: theme.spacing(1),
}))
