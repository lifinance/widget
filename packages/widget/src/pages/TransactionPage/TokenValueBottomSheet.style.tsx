import { Box, styled, Typography } from '@mui/material'

export const ContentContainer = styled(Box)({
  padding: 24,
})

export const WarningTitle = styled(Typography)({
  paddingTop: 8,
  paddingBottom: 8,
  fontSize: 18,
  fontWeight: 700,
})

export const WarningMessage = styled(Typography)(({ theme }) => ({
  paddingBottom: 16,
  color: theme.vars.palette.text.secondary,
  fontSize: 14,
}))

export const DetailRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: 6,
  paddingBottom: 6,
})

export const DetailLabel = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 500,
  color: theme.vars.palette.text.secondary,
}))

export const DetailValue = styled(Typography)({
  fontSize: 14,
  fontWeight: 700,
})

export const ButtonRow = styled(Box)({
  display: 'flex',
  marginTop: 24,
  gap: 12,
})
