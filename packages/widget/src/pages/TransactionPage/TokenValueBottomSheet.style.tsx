import { Box, styled, Typography } from '@mui/material'

export const CenterContainer = styled(Box)(() => ({
  display: 'grid',
  placeItems: 'center',
  position: 'relative',
}))

export const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}))

export const WarningTitle = styled(Typography)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  fontSize: 18,
  fontWeight: 700,
}))

export const WarningMessage = styled(Typography)(({ theme }) => ({
  paddingBottom: theme.spacing(2),
  color: theme.vars.palette.text.secondary,
  fontSize: 14,
}))

export const DetailRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: theme.spacing(0.75),
  paddingBottom: theme.spacing(0.75),
}))

export const DetailLabel = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 500,
  color: theme.vars.palette.text.secondary,
}))

export const DetailValue = styled(Typography)({
  fontSize: 14,
  fontWeight: 700,
})

export const ButtonRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(3),
  gap: theme.spacing(1.5),
}))
