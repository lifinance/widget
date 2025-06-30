import { Box, Typography, styled } from '@mui/material'
import type { PageContainerProps } from '../PageContainer.js'
import { PageContainer } from '../PageContainer.js'

export const TokenDetailsSheetContainer = styled(
  PageContainer
)<PageContainerProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}))

export const TokenDetailsSheetHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
}))

export const Label = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: '12px',
  lineHeight: '16px',
  color: theme.vars.palette.text.secondary,
}))

export const MetricContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}))
