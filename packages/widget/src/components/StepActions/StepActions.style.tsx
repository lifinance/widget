import {
  Box,
  StepConnector as MuiStepConnector,
  StepLabel as MuiStepLabel,
  Typography,
  stepConnectorClasses,
  stepLabelClasses,
  styled,
} from '@mui/material'
import { AvatarMasked } from '../Avatar/Avatar.style.js'

export const StepConnector = styled(MuiStepConnector, {
  shouldForwardProp: (prop) =>
    !['active', 'completed', 'error'].includes(prop as string),
})(({ theme }) => ({
  marginLeft: theme.spacing(2.375),
  [`.${stepConnectorClasses.line}`]: {
    minHeight: 8,
    borderLeftWidth: 2,
    borderColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.12)`,
    ...theme.applyStyles('dark', {
      borderColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.16)`,
    }),
  },
}))

export const StepLabel = styled(MuiStepLabel, {
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

export const StepLabelTypography = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 500,
  lineHeight: 1.325,
  color: theme.vars.palette.text.secondary,
  padding: theme.spacing(0.5, 0),
}))

export const StepContent = styled(Box, {
  shouldForwardProp: (prop) => !['last'].includes(prop as string),
})<{ last: boolean }>(({ theme }) => ({
  margin: theme.spacing(0, 0, 0, 2.375),
  paddingLeft: theme.spacing(4.375),
  borderLeft: `2px solid rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.12)`,
  ...theme.applyStyles('dark', {
    borderLeft: `2px solid rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.16)`,
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

export const StepAvatar = styled(AvatarMasked)(({ theme }) => ({
  color: theme.vars.palette.text.primary,
  backgroundColor: 'transparent',
}))
