import { Box, Button, ButtonBase, styled, Typography } from '@mui/material'
import type React from 'react'

/**
 * Quick-set preset pill. Mirrors the percentage chips' pill look but is always
 * visible (no reveal-on-hover), since presets are the card's primary control.
 */
export const PriceChip: React.FC<React.ComponentProps<typeof Button>> = styled(
  Button
)(({ theme }) => ({
  minWidth: 0,
  padding: theme.spacing(0.5, 1.5),
  fontSize: 12,
  fontWeight: 700,
  lineHeight: 1.3334,
  backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
  color: theme.vars.palette.text.primary,
  transition: 'background-color 200ms ease',
  '&:hover': {
    backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 8%, transparent)`,
  },
}))

/**
 * Editable variant of the preset pill: looks identical to {@link PriceChip} but
 * wraps an inline input so the user can type an arbitrary percentage premium
 * (`+__%`) instead of picking a fixed preset.
 */
export const EditablePriceChip: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    minWidth: 0,
    padding: theme.spacing(0.5, 1.5),
    borderRadius: theme.vars.shape.borderRadius,
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1.3334,
    color: theme.vars.palette.text.primary,
    backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
    transition: 'background-color 200ms ease',
    cursor: 'text',
    '&:hover, &:focus-within': {
      backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 8%, transparent)`,
    },
    '&[aria-disabled="true"]': {
      opacity: 0.5,
      pointerEvents: 'none',
    },
  }))

/** Bare input inside {@link EditablePriceChip}; inherits the pill's typography. */
export const PriceChipInput: React.FC<React.ComponentProps<'input'>> = styled(
  'input'
)(({ theme }) => ({
  appearance: 'none',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  padding: 0,
  margin: 0,
  font: 'inherit',
  color: 'inherit',
  textAlign: 'right',
  minWidth: '1ch',
  '&::placeholder': {
    color: theme.vars.palette.text.secondary,
    opacity: 1,
  },
}))

/** Token chip-avatar in the main row (mirrors the amount cards' token pill). */
export const UnitChip: React.FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
    paddingInline: theme.spacing(0.5),
    flexShrink: 0,
  })
)

export const UnitSymbol: React.FC<React.ComponentProps<typeof Typography>> =
  styled(Typography)(({ theme }) => ({
    fontSize: 18,
    fontWeight: 600,
    lineHeight: 1.4,
    whiteSpace: 'nowrap',
    color: theme.vars.palette.text.primary,
  }))

/**
 * Invert affordance anchored to the far right of the lead row. Styled as a
 * pill to mirror the percentage chips, but always visible (no reveal-on-hover).
 */
export const InvertChip: React.FC<React.ComponentProps<typeof ButtonBase>> =
  styled(ButtonBase)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(0.5),
    minWidth: 0,
    padding: theme.spacing(0.5, 1.5),
    borderRadius: '9999px',
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1.3334,
    color: theme.vars.palette.text.primary,
    backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
    transition: 'background-color 200ms ease',
    '&:hover': {
      backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 8%, transparent)`,
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
