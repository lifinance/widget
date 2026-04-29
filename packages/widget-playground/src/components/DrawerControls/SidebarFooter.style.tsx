import { Box, Button, styled } from '@mui/material'
import type { FC } from 'react'

export const FooterContainer: FC<React.ComponentProps<typeof Box>> = styled(
  Box
)({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  padding: 20,
})

export const PrimaryButton: FC<React.ComponentProps<typeof Button>> = styled(
  Button
)(({ theme }) => ({
  backgroundColor: theme.vars.palette.primary.main,
  color: '#fff',
  borderRadius: 12,
  padding: 8,
  fontSize: 16,
  fontWeight: 700,
  lineHeight: '20px',
  textTransform: 'none',
  height: 48,
  '&:hover': {
    backgroundColor: theme.vars.palette.primary.dark,
  },
}))

export const SecondaryButton: FC<React.ComponentProps<typeof Button>> = styled(
  Button
)(({ theme }) => ({
  backgroundColor: `color-mix(in srgb, ${theme.vars.palette.primary.main} 20%, transparent)`,
  color: theme.vars.palette.primary.main,
  borderRadius: 12,
  padding: 8,
  fontSize: 16,
  fontWeight: 700,
  lineHeight: '20px',
  textTransform: 'none',
  height: 48,
  '&:hover': {
    backgroundColor: `color-mix(in srgb, ${theme.vars.palette.primary.main} 30%, transparent)`,
  },
}))
