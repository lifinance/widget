import {
  Box,
  ButtonBase,
  InputBase,
  inputBaseClasses,
  styled,
  Typography,
} from '@mui/material'
import type React from 'react'
import { InputCard } from '../Card/InputCard.js'

export const maxInputFontSize = 40
export const minInputFontSize = 20
export const amountHeight = 32
export const footerFontSize = 12

export const AmountCard: React.FC<React.ComponentProps<typeof InputCard>> =
  styled(InputCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    padding: theme.spacing(2),
  }))

export const CardHeaderRow: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 0,
  height: theme.spacing(3),
}))

export const CardBodyRow: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}))

export const CardFooterRow: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: theme.spacing(3),
}))

export const LargeInput: React.FC<React.ComponentProps<typeof InputBase>> =
  styled(InputBase)(() => ({
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
    overflow: 'hidden',
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
  borderRadius: `calc(${theme.vars.shape.borderRadius} * 2)`,
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
