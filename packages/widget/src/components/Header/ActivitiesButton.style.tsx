import { Badge, Box, IconButton, styled } from '@mui/material'
import type { RouteExecutionIndicator } from '../../stores/routes/useRouteExecutionIndicators.js'

export const HistoryIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'indicator',
})<{ indicator: RouteExecutionIndicator }>(({ theme, indicator }) =>
  indicator !== 'idle'
    ? {
        backgroundColor: `color-mix(in srgb, rgb(${theme.vars.palette.info.mainChannel}) 8%, ${theme.vars.palette.background.paper})`,
        '&:hover': {
          backgroundColor: `color-mix(in srgb, rgb(${theme.vars.palette.info.mainChannel}) 12%, ${theme.vars.palette.background.paper})`,
        },
      }
    : {}
)

export const ErrorBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    padding: 0,
    minWidth: 'unset',
    width: 16,
    height: 16,
    borderRadius: '50%',
    backgroundColor: theme.vars.palette.background.paper,
    boxShadow: `0 0 0 2px ${theme.vars.palette.background.paper}`,
    top: -2,
    left: 10,
  },
}))

export const ProgressContainer = styled(Box)({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})
