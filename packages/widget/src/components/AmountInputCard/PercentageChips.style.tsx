import { Box, Button, styled } from '@mui/material'
import { cardClasses } from '@mui/material/Card'
import type React from 'react'

const chipCount = 4
const staggerStepMs = 25

const revealStagger = Object.fromEntries(
  Array.from({ length: chipCount }, (_, index) => [
    `&[data-delay="${index}"]`,
    {
      [`.${cardClasses.root}:hover &`]: {
        opacity: 1,
        transform: 'scale(1) translateX(0)',
        pointerEvents: 'auto',
        transitionDelay: `${(chipCount - 1 - index) * staggerStepMs}ms`,
      },
      [`.${cardClasses.root}:not(:hover) &`]: {
        transitionDelay: `${index * staggerStepMs}ms`,
      },
    },
  ])
)

export const ChipContainer: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
}))

export const Chip: React.FC<React.ComponentProps<typeof Button>> = styled(
  Button
)(({ theme }) => ({
  minWidth: 0,
  padding: theme.spacing(0.5, 1.5),
  fontSize: 12,
  fontWeight: 700,
  lineHeight: 1.3334,
  backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
  color: theme.vars.palette.text.primary,
  transition:
    'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 200ms cubic-bezier(0.4, 0, 0.2, 1), background-color 200ms ease',
  '&:hover': {
    backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 8%, transparent)`,
  },
  // Reveal-on-hover — only on devices that support hover. On touch there is no
  // hover, so the chips stay permanently visible (the default above) instead of
  // becoming an unreachable dead row.
  '@media (hover: hover)': {
    opacity: 0,
    transform: 'scale(0.85) translateX(10px)',
    pointerEvents: 'none',
    ...revealStagger,
    '@media (prefers-reduced-motion: reduce)': {
      transform: 'none !important',
      transitionDelay: '0ms !important',
    },
  },
}))
