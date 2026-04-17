import { Box, styled, Typography } from '@mui/material'
import type React from 'react'
import type { PageContainerProps } from '../PageContainer.js'
import { PageContainer } from '../PageContainer.js'

export const TokenDetailsSheetContainer: React.FC<
  React.ComponentProps<typeof PageContainer> & PageContainerProps
> = styled(PageContainer)<PageContainerProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}))

export const TokenDetailsSheetHeader: React.FC<
  React.ComponentProps<typeof Box>
> = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
}))

export const Label: React.FC<React.ComponentProps<typeof Typography>> = styled(
  Typography
)(({ theme }) => ({
  fontWeight: 500,
  fontSize: '12px',
  lineHeight: '16px',
  color: theme.vars.palette.text.secondary,
}))

export const MetricContainer: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  }))
