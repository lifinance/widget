import type { Step } from '@lifi/sdk';
import type { BoxProps } from '@mui/material';

export interface StepActionsProps extends BoxProps {
  step: Step;
  dense?: boolean;
}
