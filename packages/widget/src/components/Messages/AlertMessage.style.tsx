import { Box, styled } from '@mui/material'
import type React from 'react'
import type { Severity } from './types.js'

interface AlertSeverityProps {
  severity: Severity
}

export const AlertMessageCard: React.FC<
  React.ComponentProps<typeof Box> & AlertSeverityProps
> = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'severity',
})<AlertSeverityProps>(({ theme }) => ({
  borderRadius: theme.vars.shape.borderRadius,
  position: 'relative',
  whiteSpace: 'pre-line',
  width: '100%',
  paddingBottom: theme.spacing(2),
  backgroundColor: `color-mix(in srgb, ${theme.vars.palette.info.main} 12%, transparent)`,
  ...theme.applyStyles('dark', {
    backgroundColor: `color-mix(in srgb, ${theme.vars.palette.info.main} 16%, transparent)`,
  }),
  variants: [
    {
      props: {
        severity: 'warning',
      },
      style: {
        backgroundColor: `color-mix(in srgb, ${theme.vars.palette.warning.main} 32%, transparent)`,
        ...theme.applyStyles('dark', {
          backgroundColor: `color-mix(in srgb, ${theme.vars.palette.warning.main} 16%, transparent)`,
        }),
      },
    },
  ],
}))

export const AlertMessageCardTitle: React.FC<
  React.ComponentProps<typeof Box> & AlertSeverityProps
> = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'severity',
})<AlertSeverityProps>(({ theme }) => ({
  display: 'flex',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(2),
  gap: theme.spacing(1),
  color: theme.vars.palette.info.main,
  ...theme.applyStyles('dark', {
    color: `color-mix(in srgb, ${theme.vars.palette.info.main} 76%, white)`,
  }),
  variants: [
    {
      props: {
        severity: 'warning',
      },
      style: {
        color: `color-mix(in srgb, ${theme.vars.palette.warning.main} 64%, black)`,
        ...theme.applyStyles('dark', {
          color: theme.vars.palette.warning.main,
        }),
      },
    },
  ],
}))
