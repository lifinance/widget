import { Box, styled, Typography } from '@mui/material'
import type { FC } from 'react'

export const FormValuesContainer: FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  width: '100%',
}))

export const FormBlock: FC<React.ComponentProps<typeof Box>> = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

export const MethodHint: FC<React.ComponentProps<typeof Typography>> = styled(
  Typography
)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
  margin: 0,
  marginTop: theme.spacing(1.5),
  color: theme.vars.palette.text.secondary,
}))
