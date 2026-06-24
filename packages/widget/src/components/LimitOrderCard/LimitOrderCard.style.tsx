import {
  Box,
  InputBase,
  inputBaseClasses,
  styled,
  Typography,
} from '@mui/material'
import type React from 'react'
import { InputCard } from '../Card/InputCard.js'

/** Height of the large numeric input/value row, shared across limit cards. */
export const amountInputHeight = 32

/** Card shell for limit-order inputs (price, send, receive). */
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
  height: theme.spacing(3),
}))

export const CardBodyRow: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}))

export const LargeInput: React.FC<React.ComponentProps<typeof InputBase>> =
  styled(InputBase)(() => ({
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1.4,
    height: amountInputHeight,
    flex: 1,
    minWidth: 0,
    boxShadow: 'none',
    [`.${inputBaseClasses.input}`]: {
      height: amountInputHeight,
      padding: 0,
    },
    [`&.${inputBaseClasses.disabled}`]: {
      color: 'inherit',
    },
    [`.${inputBaseClasses.input}.${inputBaseClasses.disabled}`]: {
      WebkitTextFillColor: 'unset',
    },
  }))

/** Token avatar + symbol pill anchored to the right of the body row. */
export const TokenChip: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  paddingInline: theme.spacing(0.5),
  flexShrink: 0,
}))

export const TokenSymbol: React.FC<React.ComponentProps<typeof Typography>> =
  styled(Typography)(({ theme }) => ({
    fontSize: 18,
    fontWeight: 600,
    lineHeight: 1.4,
    whiteSpace: 'nowrap',
    color: theme.vars.palette.text.primary,
  }))
