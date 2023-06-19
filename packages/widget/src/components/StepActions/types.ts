import type { LifiStep, Step } from '@lifi/sdk';
import type { BoxProps } from '@mui/material';
import type { WidgetSubvariant } from '../../types';

export interface StepActionsProps extends BoxProps {
  step: LifiStep;
  dense?: boolean;
}

export interface StepDetailsLabelProps {
  step: Step;
  subvariant?: Extract<WidgetSubvariant, 'nft'>;
}
