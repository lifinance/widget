import {
  Avatar,
  StepConnector as MuiStepConnector,
  StepContent as MuiStepContent,
  StepLabel as MuiStepLabel,
} from '@mui/material';
import { stepConnectorClasses } from '@mui/material/StepConnector';
import { stepContentClasses } from '@mui/material/StepContent';
import { stepLabelClasses } from '@mui/material/StepLabel';
import { styled } from '@mui/material/styles';

export const StepIcon = styled('span', {
  shouldForwardProp: (prop) =>
    !['active', 'completed', 'error'].includes(prop as string),
})(({ theme }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  border: `2px solid ${
    theme.palette.mode === 'light'
      ? theme.palette.grey[300]
      : theme.palette.grey[800]
  }`,
}));

export const StepConnector = styled(MuiStepConnector, {
  shouldForwardProp: (prop) =>
    !['active', 'completed', 'error'].includes(prop as string),
})(({ theme }) => ({
  marginLeft: theme.spacing(1.875),
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
  [`.${stepLabelClasses.iconContainer}`]: {
    paddingLeft: theme.spacing(0.75),
    paddingRight: theme.spacing(2.75),
  },
  [`&.${stepLabelClasses.disabled}`]: {
    cursor: 'inherit',
  },
}));

export const StepContent = styled(MuiStepContent, {
  shouldForwardProp: (prop) =>
    !['active', 'completed', 'error'].includes(prop as string),
})(({ theme }) => ({
  borderLeft: `2px solid ${
    theme.palette.mode === 'light'
      ? theme.palette.grey[300]
      : theme.palette.grey[800]
  }`,
  marginLeft: theme.spacing(1.875),
  paddingLeft: theme.spacing(3.875),
  [`&.${stepContentClasses.last}`]: {
    borderLeft: 'none',
    paddingLeft: theme.spacing(4.1875),
  },
}));

export const StepAvatar = styled(Avatar)(({ theme, variant }) => ({
  color: theme.palette.text.primary,
  backgroundColor: 'transparent',
}));
