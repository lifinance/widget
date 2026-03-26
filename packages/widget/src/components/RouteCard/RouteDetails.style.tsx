import InfoOutlined from '@mui/icons-material/InfoOutlined'
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
  lineHeight: 1.3334,
  color: theme.vars.palette.text.secondary,
}))

export const DetailValue = styled(Typography)(() => ({
  fontSize: 12,
  fontWeight: 700,
  lineHeight: 1.3334,
  textAlign: 'right',
}))

export const DetailInfoIcon = styled(InfoOutlined)(({ theme }) => ({
  fontSize: 16,
  color: theme.vars.palette.text.secondary,
}))
