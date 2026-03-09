import { Box, styled } from '@mui/material'

export const BadgeRoot = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5, 0.75),
  borderRadius: 12,
  backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
}))
