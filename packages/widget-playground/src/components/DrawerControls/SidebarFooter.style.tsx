import { Box, Link, styled } from '@mui/material'
import type { FC } from 'react'

export const FooterContainer: FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2.5),
}))

export const FooterLink: FC<React.ComponentProps<typeof Link>> = styled(Link)(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `color-mix(in srgb, ${theme.vars.palette.primary.main} 20%, transparent)`,
    color: theme.vars.palette.primary.main,
    borderRadius: 12,
    padding: theme.spacing(1),
    fontSize: 16,
    fontWeight: 700,
    lineHeight: '20px',
    textDecoration: 'none',
    textTransform: 'none',
    height: 48,
    '&:hover': {
      backgroundColor: `color-mix(in srgb, ${theme.vars.palette.primary.main} 30%, transparent)`,
    },
  })
)
