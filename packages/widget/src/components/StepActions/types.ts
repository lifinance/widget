import type { Step } from '@lifi/sdk';
import type { BoxProps } from '@mui/material';
import type { WidgetVariant } from '../../types';

export interface StepActionsProps extends BoxProps {
  step: Step;
  dense?: boolean;
}

export interface StepDetailsLabelProps {
  step: Step;
  variant?: Extract<WidgetVariant, 'nft'>;
}
