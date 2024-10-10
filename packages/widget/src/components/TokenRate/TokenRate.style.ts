import { Typography, styled } from '@mui/material'

export const TokenRateTypography = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  lineHeight: 1.429,
  fontWeight: 500,
  color: theme.palette.text.primary,
  cursor: 'pointer',
  '&:hover': {
    opacity: 1,
  },
  opacity: 0.56,
  transition: theme.transitions.create(['opacity'], {
    duration: theme.transitions.duration.enteringScreen,
    easing: theme.transitions.easing.easeOut,
  }),
}))
