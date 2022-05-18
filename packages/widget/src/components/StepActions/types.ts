import { Step } from '@lifinance/sdk';
import { BoxProps } from '@mui/material';

export interface StepActionsProps extends BoxProps {
  step: Step;
  dense?: boolean;
}
