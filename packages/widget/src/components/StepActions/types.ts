import type { LifiStep, Step } from '@lifi/sdk';
import type { BoxProps } from '@mui/material';
import type { WidgetVariant } from '../../types';

export interface StepActionsProps extends BoxProps {
  step: LifiStep;
  dense?: boolean;
}

export interface StepDetailsLabelProps {
  step: Step;
  variant?: Extract<WidgetVariant, 'nft'>;
}
