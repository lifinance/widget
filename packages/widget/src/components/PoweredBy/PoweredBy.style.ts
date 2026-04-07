import { Link as MuiLink, styled } from '@mui/material'
import type React from 'react'

export const Link: React.FC<React.ComponentProps<typeof MuiLink>> = styled(
  MuiLink
)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  border: 'none',
  ':hover': {
    color: theme.vars.palette.primary.main,
  },
}))
