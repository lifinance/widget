import {
  Box,
  ButtonBase,
  InputBase,
  inputBaseClasses,
  styled,
  Typography,
} from '@mui/material'
import type React from 'react'
import type { FormType } from '../../stores/form/types.js'
import { InputCard } from '../Card/InputCard.js'

export const maxInputFontSize = 28
export const minInputFontSize = 20
export const amountHeight = 32
export const footerFontSize = 12

export const AmountCard: React.FC<
  React.ComponentProps<typeof InputCard> & {
    formType?: FormType
    mask?: boolean
  }
> = styled(InputCard, {
  shouldForwardProp: (prop) => !['formType', 'mask'].includes(prop as string),
})<{ formType?: FormType; mask?: boolean }>(
  ({ theme, formType, mask = true }) => {
    const cardVariant = theme.components?.MuiCard?.defaultProps?.variant
    // Notch faces the swap button between the stacked cards: bottom edge for the
    // top (send) card, top edge for the bottom (receive) card.
    const vertical = formType === 'to' ? '-4px' : 'calc(100% + 4px)'
    return {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1),
      padding: theme.spacing(2),
      ...(cardVariant !== 'outlined' &&
        mask && {
          mask: `radial-gradient(circle 20px at 50% ${vertical}, #fff0 96%, #fff) 100% 100% / 100% 100% no-repeat`,
        }),
    }
  }
)

export const CardHeaderRow: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 0,
  height: theme.spacing(2),
}))

export const CardBodyRow: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}))

export const CardFooterRow: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: theme.spacing(2),
}))

export const LargeInput: React.FC<React.ComponentProps<typeof InputBase>> =
  styled(InputBase)(({ theme }) => ({
    fontSize: maxInputFontSize,
    fontWeight: 700,
    lineHeight: 1.4,
    height: amountHeight,
    flex: 1,
    minWidth: 0,
    boxShadow: 'none',
    [`.${inputBaseClasses.input}`]: {
      height: amountHeight,
      padding: 0,
    },
    [`.${inputBaseClasses.input}::placeholder`]: {
      color: theme.vars.palette.text.primary,
      opacity: 0.5,
    },
    '& input[type="number"]::-webkit-outer-spin-button, & input[type="number"]::-webkit-inner-spin-button':
      {
        WebkitAppearance: 'none',
        margin: 0,
      },
    '& input[type="number"]': {
      MozAppearance: 'textfield',
    },
    [`&.${inputBaseClasses.disabled}`]: {
      color: 'inherit',
    },
    [`.${inputBaseClasses.input}.${inputBaseClasses.disabled}`]: {
      WebkitTextFillColor: 'unset',
    },
  }))

export const AmountDisplay: React.FC<React.ComponentProps<typeof Typography>> =
  styled(Typography)(() => ({
    fontSize: maxInputFontSize,
    fontWeight: 700,
    lineHeight: 1.4,
    height: amountHeight,
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    overflow: 'visible',
    whiteSpace: 'nowrap',
  }))

export const FooterText: React.FC<React.ComponentProps<typeof Typography>> =
  styled(Typography)(({ theme }) => ({
    fontSize: footerFontSize,
    fontWeight: 500,
    lineHeight: 1,
    color: theme.vars.palette.text.secondary,
  }))

export const CardContainer: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(() => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
}))

export const ToggleButton: React.FC<
  React.ComponentProps<typeof ButtonBase> & { clickable?: boolean }
> = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'clickable',
})<{ clickable?: boolean }>(({ theme, clickable }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.25),
  borderRadius: theme.vars.shape.borderRadiusSecondary,
  padding: theme.spacing(0.25, 0.5),
  backgroundColor: 'transparent',
  ...(clickable
    ? {
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
        },
      }
    : {
        cursor: 'default',
        pointerEvents: 'none',
      }),
}))
