import type { LiFiStepExtended, Step } from '@lifi/sdk'
import type { BoxProps } from '@mui/material'
import type {
  ModeOptions,
  WidgetFeeConfig,
  WidgetMode,
} from '../../types/widget.js'

export interface StepActionsProps extends BoxProps {
  step: LiFiStepExtended
  dense?: boolean
}

export interface StepDetailsLabelProps {
  step: Step
  mode?: Extract<WidgetMode, 'custom'>
  modeOptions?: ModeOptions
  feeConfig?: WidgetFeeConfig
  relayerSupport?: boolean
}

export interface IncludedStepsProps {
  step: LiFiStepExtended
}
