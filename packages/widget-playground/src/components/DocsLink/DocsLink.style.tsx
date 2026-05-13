import { Link, styled } from '@mui/material'
import type { FC } from 'react'

export const StyledDocsLink: FC<React.ComponentProps<typeof Link>> = styled(
  Link
)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 500,
  lineHeight: '18px',
  color: theme.vars.palette.primary.main,
  alignSelf: 'flex-start',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}))
