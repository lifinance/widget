import { Box, type Theme, styled } from '@mui/material'
import { formatSize } from '../../utils/format'
import { getGapToExpansion } from './Expansion.style'
interface ExpansionSlideWrapperProps {
  expansionWidth: string | number
}

interface ExpansionSlideContentProps {
  open: boolean
  expansionWidth: string | number
}

const slideMixinWrapper = (theme: Theme, expansionWidth: string) => ({
  transition: theme.transitions.create(['width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  width: expansionWidth,
})

const slideInMixinContent = (theme: Theme) => ({
  transition: theme.transitions.create(['left', 'opacity'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.leavingScreen,
  }),
  left: 0,
  opacity: 1,
})

const slideOutMixinContent = (
  theme: Theme,
  expansionWidth: string,
  gapToExpansion: string
) => ({
  transition: theme.transitions.create(['left', 'opacity'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.leavingScreen,
  }),
  left: `calc(-${expansionWidth} - ${gapToExpansion})`,
  opacity: 0,
})

export const ExpansionSlideWrapper = styled(Box, {
  shouldForwardProp: (prop) => !['expansionWidth'].includes(prop as string),
})<ExpansionSlideWrapperProps>(({ theme, expansionWidth }) => ({
  position: 'relative',
  ...slideMixinWrapper(theme, formatSize(expansionWidth)),
}))

export const ExpansionSlideContent = styled(Box, {
  shouldForwardProp: (prop) =>
    !['open', 'expansionWidth'].includes(prop as string),
})<ExpansionSlideContentProps>(({ theme, open, expansionWidth }) => {
  const gapToExpansion = getGapToExpansion(theme)
  return {
    position: 'absolute',
    top: 0,
    ...(open
      ? slideInMixinContent(theme)
      : slideOutMixinContent(
          theme,
          formatSize(expansionWidth),
          gapToExpansion
        )),
  }
})
