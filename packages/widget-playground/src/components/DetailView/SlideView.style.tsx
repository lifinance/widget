import { Box, styled } from '@mui/material'
import type { FC } from 'react'

export const SlideViewTrack: FC<
  React.ComponentProps<typeof Box> & { showSecondary: boolean }
> = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'showSecondary',
})<{ showSecondary: boolean }>(({ theme, showSecondary }) => ({
  display: 'flex',
  flex: '1 0 0',
  minHeight: 0,
  width: '200%',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.enteringScreen,
    easing: theme.transitions.easing.sharp,
  }),
  transform: showSecondary ? 'translateX(-50%)' : 'none',
}))

export const SlideViewPanel: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  {
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 50%',
    width: '50%',
    maxWidth: '50%',
    minWidth: 0,
    minHeight: 0,
    overflow: 'hidden',
  }
)
