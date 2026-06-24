import { Box, ButtonBase, styled } from '@mui/material'
import type React from 'react'

/** Invert affordance anchored to the far right of the lead row. */
export const InvertChip: React.FC<React.ComponentProps<typeof ButtonBase>> =
  styled(ButtonBase)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: theme.spacing(3),
    height: theme.spacing(3),
    borderRadius: '9999px',
    color: theme.vars.palette.text.secondary,
    '&:hover': {
      backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 8%, transparent)`,
    },
  }))

/** Percent-preset chip row — wraps, tight rhythm, sits below the main row. */
export const ChipsRow: React.FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
  })
)

export const PresetChip: React.FC<
  React.ComponentProps<typeof ButtonBase> & { selected?: boolean }
> = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ theme, selected }) => ({
  height: theme.spacing(3),
  paddingInline: theme.spacing(1),
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1,
  borderRadius: '9999px',
  color: selected
    ? theme.vars.palette.primary.main
    : theme.vars.palette.text.secondary,
  backgroundColor: selected
    ? `color-mix(in srgb, ${theme.vars.palette.primary.main} 12%, transparent)`
    : `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
  '&:hover': {
    backgroundColor: selected
      ? `color-mix(in srgb, ${theme.vars.palette.primary.main} 18%, transparent)`
      : `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 8%, transparent)`,
  },
}))

/** Loud "far from market" warning, shown when |distance| >= threshold. */
export const OffMarketAlert: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(0.5),
    padding: theme.spacing(0.75, 1),
    borderRadius: `calc(${theme.vars.shape.borderRadius} * 2)`,
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 1.3,
    color: theme.vars.palette.warning.main,
    backgroundColor: `color-mix(in srgb, ${theme.vars.palette.warning.main} 12%, transparent)`,
  }))
