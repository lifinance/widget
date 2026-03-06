import { Box, Link, styled, Typography } from '@mui/material'

export const TransactionLinkContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderRadius: theme.vars.shape.borderRadiusSecondary,
  color: theme.vars.palette.text.primary,
  backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
}))

export const StatusIconCircle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'failed',
})<{ failed?: boolean }>(({ theme, failed }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: failed
    ? `rgba(${theme.vars.palette.error.mainChannel} / 0.12)`
    : `rgba(${theme.vars.palette.success.mainChannel} / 0.12)`,
  marginRight: theme.spacing(1),
}))

export const TransactionLinkLabel = styled(Typography)(() => ({
  flex: 1,
  fontSize: 12,
  fontWeight: 400,
  color: 'inherit',
}))

export const ExternalLinkIcon = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  borderRadius: '50%',
  textDecoration: 'none',
  color: 'inherit',
  '&:hover': {
    backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
  },
}))
