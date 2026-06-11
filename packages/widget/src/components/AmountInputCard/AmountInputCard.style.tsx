import {
  Box,
  InputBase,
  inputBaseClasses,
  styled,
  Typography,
} from '@mui/material'
import type React from 'react'

export const maxInputFontSize = 40
export const minInputFontSize = 20
const amountHeight = 32

export const CardHeaderRow: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0, 0, 0.5, 0),
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
  paddingTop: theme.spacing(0.5),
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
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 1,
    color: theme.vars.palette.text.secondary,
  }))

export const CardContainer: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  position: 'relative',
}))
