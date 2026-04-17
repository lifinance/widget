import {
  Box,
  StepConnector as MuiStepConnector,
  StepLabel as MuiStepLabel,
  stepConnectorClasses,
  stepLabelClasses,
  styled,
  Typography,
} from '@mui/material'
import type React from 'react'
import { AvatarMasked } from '../Avatar/Avatar.style.js'

export const StepConnector: React.FC<
  React.ComponentProps<typeof MuiStepConnector> & { last?: boolean }
> = styled(MuiStepConnector, {
  shouldForwardProp: (prop) =>
    !['active', 'completed', 'error'].includes(prop as string),
})(({ theme }) => ({
  marginLeft: theme.spacing(2.375),
  [`.${stepConnectorClasses.line}`]: {
    minHeight: 8,
    borderLeftWidth: 2,
    borderColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 12%, transparent)`,
    ...theme.applyStyles('dark', {
      borderColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 16%, transparent)`,
    }),
  },
}))

export const StepLabel: React.FC<
  React.ComponentProps<typeof MuiStepLabel> & { last?: boolean }
> = styled(MuiStepLabel, {
  shouldForwardProp: (prop) =>
    !['active', 'completed', 'error', 'disabled'].includes(prop as string),
})(({ theme }) => ({
  padding: 0,
  alignItems: 'center',
  [`.${stepLabelClasses.iconContainer}`]: {
    paddingLeft: theme.spacing(1.25),
    paddingRight: theme.spacing(3.25),
  },
  [`.${stepLabelClasses.labelContainer}`]: {
    minHeight: 24,
    display: 'flex',
    alignItems: 'center',
  },
  [`&.${stepLabelClasses.disabled}`]: {
    cursor: 'inherit',
  },
}))

export const StepLabelTypography: React.FC<
  React.ComponentProps<typeof Typography> & { last?: boolean }
> = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 500,
  lineHeight: 1.325,
  color: theme.vars.palette.text.secondary,
  padding: theme.spacing(0.5, 0),
}))

export const StepContent: React.FC<
  React.ComponentProps<typeof Box> & { last?: boolean }
> = styled(Box, {
  shouldForwardProp: (prop) => !['last'].includes(prop as string),
})<{ last?: boolean }>(({ theme }) => ({
  margin: theme.spacing(0, 0, 0, 2.375),
  paddingLeft: theme.spacing(4.375),
  borderLeft: `2px solid color-mix(in srgb, ${theme.vars.palette.common.onBackground} 12%, transparent)`,
  ...theme.applyStyles('dark', {
    borderLeft: `2px solid color-mix(in srgb, ${theme.vars.palette.common.onBackground} 16%, transparent)`,
  }),
  variants: [
    {
      props: ({ last }) => last,
      style: {
        borderLeft: 'none',
        paddingLeft: theme.spacing(4.625),
      },
    },
  ],
}))

export const StepAvatar: React.FC<React.ComponentProps<typeof AvatarMasked>> =
  styled(AvatarMasked)(({ theme }) => ({
    color: theme.vars.palette.text.primary,
    backgroundColor: 'transparent',
  }))
