import { Box, styled, Typography } from '@mui/material'
import type React from 'react'

export const TextSecondaryContainer: React.FC<
  React.ComponentProps<typeof Box> & { dot?: boolean }
> = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  flex: 1,
  height: 16,
}))

export const TextSecondary: React.FC<
  React.ComponentProps<typeof Typography> & { dot?: boolean }
> = styled(Typography, {
  shouldForwardProp: (prop: string) => !['dot'].includes(prop),
})<{ dot?: boolean }>(({ theme }) => ({
  fontSize: 12,
  lineHeight: 1,
  fontWeight: 500,
  color: theme.vars.palette.text.secondary,
  whiteSpace: 'nowrap',
  variants: [
    {
      props: ({ dot }) => dot,
      style: {
        color: `color-mix(in srgb, ${theme.vars.palette.text.secondary} 56%, transparent)`,
      },
    },
  ],
}))

export const TokenDivider: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  height: 16,
  borderLeftWidth: 2,
  borderLeftStyle: 'solid',
  borderColor: theme.vars.palette.grey[300],
  ...theme.applyStyles('dark', {
    borderColor: theme.vars.palette.grey[800],
  }),
}))
