import {
  StepConnector as MuiStepConnector,
  StepContent as MuiStepContent,
  StepLabel as MuiStepLabel,
} from '@mui/material';
import { stepConnectorClasses } from '@mui/material/StepConnector';
import { stepContentClasses } from '@mui/material/StepContent';
import { stepLabelClasses } from '@mui/material/StepLabel';
import { styled } from '@mui/material/styles';

export const StepIcon = styled('span')(({ theme }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  border: `2px solid ${theme.palette.grey[300]}`,
}));

export const StepConnector = styled(MuiStepConnector)(({ theme }) => ({
  marginLeft: theme.spacing(1.875),
  [`.${stepConnectorClasses.line}`]: {
    minHeight: 8,
    borderLeftWidth: 2,
    borderColor: theme.palette.grey[300],
  },
}));

export const StepLabel = styled(MuiStepLabel)(({ theme }) => ({
  padding: 0,
  [`.${stepLabelClasses.iconContainer}`]: {
    paddingLeft: theme.spacing(1.25),
    paddingRight: theme.spacing(3.25),
  },
}));

export const StepContent = styled(MuiStepContent)(({ theme }) => ({
  borderLeft: `2px solid ${theme.palette.grey[300]}`,
  marginLeft: theme.spacing(1.875),
  paddingLeft: theme.spacing(3.875),
  [`&.${stepContentClasses.last}`]: {
    borderLeft: 'none',
    paddingLeft: theme.spacing(4.1875),
  },
}));
