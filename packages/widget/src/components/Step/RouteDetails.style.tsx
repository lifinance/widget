import { Box, styled, Typography } from '@mui/material'

export const DetailRow = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 8,
}))

export const DetailLabelContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
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
