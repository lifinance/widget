import type { LiFiStepExtended, Step } from '@lifi/sdk'
import type { BoxProps } from '@mui/material'
import type {
  SubvariantOptions,
  WidgetFeeConfig,
  WidgetSubvariant,
} from '../../types/widget.js'

export interface StepActionsProps extends BoxProps {
  step: LiFiStepExtended
  dense?: boolean
}

export interface StepDetailsLabelProps {
  step: Step
  subvariant?: WidgetSubvariant
  subvariantOptions?: SubvariantOptions
  feeConfig?: WidgetFeeConfig
  relayerSupport?: boolean
}

export interface IncludedStepsProps {
  step: LiFiStepExtended
}
