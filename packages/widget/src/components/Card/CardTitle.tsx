import { styled, Typography } from '@mui/material'

export const CardTitle = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  lineHeight: 1,
  fontWeight: 700,
  padding: theme.spacing(2, 2, 0, 2),
  textAlign: 'left',
  color: theme.vars.palette.text.primary,
}))
