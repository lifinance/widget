import type { ScopedCssBaselineProps } from '@mui/material'
import { Box, ScopedCssBaseline, styled } from '@mui/material'
import type React from 'react'
import { getWidgetMaxHeight } from '../../utils/widgetSize.js'

export const routesExpansionWidth = '436px'

interface ContainerProps extends ScopedCssBaselineProps {
  minimumHeight: boolean
}

export const Container: React.FC<
  React.ComponentProps<typeof ScopedCssBaseline> & ContainerProps
> = styled(ScopedCssBaseline, {
  shouldForwardProp: (prop) => !['minimumHeight'].includes(prop as string),
})<ContainerProps>(({ theme, minimumHeight }) => {
  return {
    ...theme.container,
    backgroundColor: theme.vars.palette.background.default,
    overflow: 'hidden',
    width: routesExpansionWidth,
    display: 'flex',
    flexDirection: 'column',
    whiteSpace: 'normal',
    ...(theme.container?.display !== 'flex'
      ? {
          maxHeight: getWidgetMaxHeight(theme),
          ...(minimumHeight ? { '&': { height: 'auto' } } : {}),
        }
      : { height: minimumHeight ? 'auto' : '100%' }),
    ...theme.routesContainer,
  }
})

export const Header: React.FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    backgroundColor: theme.vars.palette.background.default,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1.5, 3),
    position: 'sticky',
    top: 0,
    zIndex: 1200,
  })
)
