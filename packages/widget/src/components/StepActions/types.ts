import { Step } from '@lifi/sdk';
import { BoxProps } from '@mui/material';

export interface StepActionsProps extends BoxProps {
  step: Step;
  dense?: boolean;
}
