import { Box, styled } from '@mui/material'
import { cardClasses } from '@mui/material/Card'
import { ButtonTertiary } from '../ButtonTertiary.js'

export const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
}))

export const MaxButton = styled(ButtonTertiary)(({ theme }) => ({
  padding: theme.spacing(0.5, 1, 0.5, 1),
  margin: theme.spacing(0, 0, 0, 0.5),
  lineHeight: 1,
  fontSize: '0.75rem',
  minWidth: 'unset',
  height: 24,
  opacity: 0,
  transform: 'scale(0.85) translateY(-10px)',
  transition:
    'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  '&[data-delay="0"]': {
    [`.${cardClasses.root}:hover &`]: {
      opacity: 1,
      transform: 'scale(1) translateY(0)',
      transitionDelay: '75ms',
    },
    [`.${cardClasses.root}:not(:hover) &`]: {
      opacity: 0,
      transform: 'scale(0.85) translateY(-10px)',
      transitionDelay: '0ms',
    },
  },
  '&[data-delay="1"]': {
    [`.${cardClasses.root}:hover &`]: {
      opacity: 1,
      transform: 'scale(1) translateY(0)',
      transitionDelay: '50ms',
    },
    [`.${cardClasses.root}:not(:hover) &`]: {
      opacity: 0,
      transform: 'scale(0.85) translateY(-10px)',
      transitionDelay: '25ms',
    },
  },
  '&[data-delay="2"]': {
    [`.${cardClasses.root}:hover &`]: {
      opacity: 1,
      transform: 'scale(1) translateY(0)',
      transitionDelay: '25ms',
    },
    [`.${cardClasses.root}:not(:hover) &`]: {
      opacity: 0,
      transform: 'scale(0.85) translateY(-10px)',
      transitionDelay: '50ms',
    },
  },
  '&[data-delay="3"]': {
    [`.${cardClasses.root}:hover &`]: {
      opacity: 1,
      transform: 'scale(1) translateY(0)',
      transitionDelay: '0ms',
    },
    [`.${cardClasses.root}:not(:hover) &`]: {
      opacity: 0,
      transform: 'scale(0.85) translateY(-10px)',
      transitionDelay: '75ms',
    },
  },
}))
