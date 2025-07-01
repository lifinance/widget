import { Box, type Theme, styled } from '@mui/material'
import { formatSize } from '../../utils/format'
import { getGapToExpansion } from './Expansion.style'

interface ExpansionSlideBaseProps {
  open: boolean
  expansionWidth: string | number
}

interface ExpansionSlideContentProps extends ExpansionSlideBaseProps {
  expansionHeight: string | number
}

const slideInMixinWrapper = (theme: Theme, expansionWidth: string) => ({
  transition: theme.transitions.create(['width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  width: expansionWidth,
})

const slideOutMixinWrapper = (theme: Theme) => ({
  transition: theme.transitions.create(['width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: 0,
})

const slideInMixinContent = (theme: Theme, expansionHeight: string) => ({
  transition: theme.transitions.create(['left', 'height', 'opacity'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  left: 0,
  height: expansionHeight,
  opacity: 1,
})

const slideOutMixinContent = (
  theme: Theme,
  expansionWidth: string,
  gapToExpansion: string
) => ({
  transition: theme.transitions.create(['left', 'height', 'opacity'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.leavingScreen,
  }),
  left: `calc(-${expansionWidth} - ${gapToExpansion})`,
  height: 0,
  opacity: 0,
})

export const ExpansionSlideWrapper = styled(Box, {
  shouldForwardProp: (prop) =>
    !['open', 'expansionWidth'].includes(prop as string),
})<ExpansionSlideBaseProps>(({ theme, open, expansionWidth }) => ({
  position: 'relative',
  ...(open
    ? slideInMixinWrapper(theme, formatSize(expansionWidth))
    : slideOutMixinWrapper(theme)),
}))

export const ExpansionSlideContent = styled(Box, {
  shouldForwardProp: (prop) =>
    !['open', 'expansionWidth', 'expansionHeight'].includes(prop as string),
})<ExpansionSlideContentProps>(
  ({ theme, open, expansionWidth, expansionHeight }) => {
    const gapToExpansion = getGapToExpansion(theme)
    return {
      position: 'absolute',
      top: 0,
      ...(open
        ? slideInMixinContent(theme, formatSize(expansionHeight))
        : slideOutMixinContent(
            theme,
            formatSize(expansionWidth),
            gapToExpansion
          )),
    }
  }
)
