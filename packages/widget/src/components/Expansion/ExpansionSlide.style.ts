import { Box, type Theme, styled } from '@mui/material'
import { chainExpansionWidth } from './Expansion.style'

const slideInMixinWrapper = (theme: Theme) => ({
  transition: theme.transitions.create(['width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  width: chainExpansionWidth,
})

const slideOutMixinWrapper = (theme: Theme) => ({
  transition: theme.transitions.create(['width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: 0,
})

const slideInMixinContent = (theme: Theme) => ({
  transition: theme.transitions.create(['left'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  left: 0,
})

const slideOutMixinContent = (theme: Theme) => ({
  transition: theme.transitions.create(['left'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.leavingScreen,
  }),
  left: `-${chainExpansionWidth}`,
})

export const ExpansionSlideWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open: boolean }>(({ theme, open }) => ({
  position: 'relative',
  ...(open ? slideInMixinWrapper(theme) : slideOutMixinWrapper(theme)),
}))

export const ExpansionSlideContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open: boolean }>(({ theme, open }) => ({
  position: 'absolute',
  top: 0,
  ...(open ? slideInMixinContent(theme) : slideOutMixinContent(theme)),
}))
