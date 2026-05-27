import type { BoxProps } from '@mui/material'
import { Box, styled, Typography } from '@mui/material'
import type React from 'react'

export const NotFoundContainer: React.FC<BoxProps> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    flex: 1,
    padding: theme.spacing(3),
  })
)

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
