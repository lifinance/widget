import { Box, styled, Typography } from '@mui/material'
import type { FC } from 'react'

export const Content: FC<React.ComponentProps<typeof Box>> = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 32,
  flex: '1 0 0',
  minHeight: 0,
  overflowY: 'auto',
  padding: '24px 20px',
})

export const TitleSection: FC<React.ComponentProps<typeof Box>> = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: '100%',
})

export const Title: FC<React.ComponentProps<typeof Typography>> = styled(
  Typography
)(({ theme }) => ({
  fontSize: 24,
  fontWeight: 700,
  lineHeight: '32px',
  margin: 0,
  color: theme.vars.palette.text.primary,
}))

export const Description: FC<React.ComponentProps<typeof Typography>> = styled(
  Typography
)(({ theme }) => ({
  fontSize: 16,
  fontWeight: 500,
  lineHeight: '24px',
  margin: 0,
  color: theme.vars.palette.text.secondary,
}))

export const CardsContainer: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    width: '100%',
  }
)
