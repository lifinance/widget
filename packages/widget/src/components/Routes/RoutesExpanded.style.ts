import type { ScopedCssBaselineProps } from '@mui/material'
import { Box, ScopedCssBaseline, styled } from '@mui/material'
import { defaultMaxHeight } from '../../config/constants.js'

export const routesExpansionWidth = '436px'

interface ContainerProps extends ScopedCssBaselineProps {
  minimumHeight: boolean
}

export const Container = styled(ScopedCssBaseline, {
  shouldForwardProp: (prop) => !['minimumHeight'].includes(prop as string),
})<ContainerProps>(({ theme, minimumHeight }) => ({
  ...theme.container,
  backgroundColor: theme.vars.palette.background.default,
  overflow: 'hidden',
  width: routesExpansionWidth,
  display: 'flex',
  flexDirection: 'column',
  whiteSpace: 'normal',
  ...(theme.container?.display !== 'flex'
    ? {
        maxHeight:
          theme.container?.maxHeight ??
          theme.container?.height ??
          defaultMaxHeight,
        ...(minimumHeight ? { '&': { height: 'auto' } } : {}),
      }
    : { height: minimumHeight ? 'auto' : '100%' }),
  ...theme.routesContainer,
}))

export const Header = styled(Box)(({ theme }) => ({
  backgroundColor: theme.vars.palette.background.default,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1.5, 3),
  position: 'sticky',
  top: 0,
  zIndex: 1200,
}))
