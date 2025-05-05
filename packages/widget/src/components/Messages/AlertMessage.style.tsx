import { Box, styled } from '@mui/material'
import type { Severity } from './types.js'

interface AlertSeverityProps {
  severity: Severity
}

export const AlertMessageCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'severity',
})<AlertSeverityProps>(({ theme }) => ({
  borderRadius: theme.vars.shape.borderRadius,
  position: 'relative',
  whiteSpace: 'pre-line',
  width: '100%',
  paddingBottom: theme.spacing(2),
  backgroundColor: `rgba(${theme.vars.palette.info.mainChannel} / 0.12)`,
  ...theme.applyStyles('dark', {
    backgroundColor: `rgba(${theme.vars.palette.info.mainChannel} / 0.16)`,
  }),
  variants: [
    {
      props: {
        severity: 'warning',
      },
      style: {
        backgroundColor: `rgba(${theme.vars.palette.warning.mainChannel} / 0.32)`,
        ...theme.applyStyles('dark', {
          backgroundColor: `rgba(${theme.vars.palette.warning.mainChannel} / 0.16)`,
        }),
      },
    },
  ],
}))

export const AlertMessageCardTitle = styled(Box, {
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
