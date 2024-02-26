import {
  Box,
  StepConnector as MuiStepConnector,
  StepLabel as MuiStepLabel,
  Typography,
  alpha,
  stepConnectorClasses,
  stepLabelClasses,
  styled,
} from '@mui/material';
import { AvatarMasked } from '../Avatar/Avatar.style.js';

export const StepConnector = styled(MuiStepConnector, {
  shouldForwardProp: (prop) =>
    !['active', 'completed', 'error'].includes(prop as string),
})(({ theme }) => ({
  marginLeft: theme.spacing(2.375),
  [`.${stepConnectorClasses.line}`]: {
    minHeight: 8,
    borderLeftWidth: 2,
    borderColor:
      theme.palette.mode === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[800],
  },
}));

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
}));

export const StepLabelTypography = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 500,
  lineHeight: 1.325,
  color: theme.palette.text.secondary,
  padding: theme.spacing(0.5, 0),
}));

export const StepContent = styled(Box, {
  shouldForwardProp: (prop) => !['last'].includes(prop as string),
})<{ last: boolean }>(({ theme, last }) => ({
  borderLeft: last
    ? 'none'
    : `2px solid ${
        theme.palette.mode === 'light'
          ? theme.palette.grey[300]
          : theme.palette.grey[800]
      }`,
  margin: theme.spacing(0, 0, 0, 2.375),
  paddingLeft: last ? theme.spacing(4.625) : theme.spacing(4.375),
}));

export const StepAvatar = styled(AvatarMasked)(({ theme }) => ({
  color: theme.palette.text.primary,
  backgroundColor: 'transparent',
}));

export const IconTypography = styled(Typography)(({ theme }) => ({
  color:
    theme.palette.mode === 'light'
      ? alpha(theme.palette.common.black, 0.32)
      : alpha(theme.palette.common.white, 0.4),
  lineHeight: 0,
}));
