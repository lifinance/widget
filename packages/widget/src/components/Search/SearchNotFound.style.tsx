import type { BoxProps } from '@mui/material'
import { Box, styled, Typography } from '@mui/material'
import type React from 'react'
import { searchContainerHeight } from './SearchInput.style.js'

interface NotFoundContainerProps extends BoxProps {
  adjustForStickySearchInput?: boolean
}

export const NotFoundContainer: React.FC<
  React.ComponentProps<typeof Box> & NotFoundContainerProps
> = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'adjustForStickySearchInput',
})<NotFoundContainerProps>(({ theme, adjustForStickySearchInput }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  flex: 1,
  padding: theme.spacing(3),
  ...(adjustForStickySearchInput && theme.header?.position === 'fixed'
    ? { paddingTop: `calc(${searchContainerHeight}px + ${theme.spacing(3)})` }
    : {}),
}))

export const NotFoundMessage: React.FC<
  React.ComponentProps<typeof Typography>
> = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  whiteSpace: 'normal',
  color: theme.vars.palette.text.secondary,
  textAlign: 'center',
  flex: 1,
  marginTop: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}))

export const NotFoundIconContainer: React.FC<
  React.ComponentProps<typeof Typography>
> = styled(Typography)(() => ({
  fontSize: 48,
  lineHeight: 1,
}))
