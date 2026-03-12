import { Box, styled, Typography } from '@mui/material'

export const DetailRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(1),
}))

export const DetailLabelContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}))

export const DetailLabel = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 500,
  lineHeight: '16px',
  color: theme.vars.palette.text.secondary,
}))

export const DetailValue = styled(Typography)(() => ({
  fontSize: 12,
  fontWeight: 700,
  lineHeight: '16px',
  textAlign: 'right',
}))

export const DetailInfoIcon = {
  fontSize: 16,
  color: 'text.secondary',
} as const
