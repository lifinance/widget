import type { LiFiStep, Step } from '@lifi/sdk';
import type { BoxProps } from '@mui/material';
import type {
  SubvariantOptions,
  WidgetSubvariant,
} from '../../types/widget.js';

export interface StepActionsProps extends BoxProps {
  step: LiFiStep;
  dense?: boolean;
}

export interface StepDetailsLabelProps {
  step: Step;
  subvariant?: Extract<WidgetSubvariant, 'custom'>;
  subvariantOptions?: SubvariantOptions;
}

export interface IncludedStepsProps {
  step: LiFiStep;
  subvariant?: WidgetSubvariant;
  subvariantOptions?: SubvariantOptions;
}
