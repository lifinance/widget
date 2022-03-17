import { StepIconProps, Stepper } from '@mui/material';
import Stack from '@mui/material/Stack';
import { SwapStepperProps } from '.';
import {
  SwapStep,
  SwapStepConnector,
  SwapStepIcon,
  SwapStepLabel,
} from './SwapStepper.style';

function StepIcon(props: StepIconProps) {
  return <SwapStepIcon />;
}

export function SwapStepper({ steps }: SwapStepperProps) {
  if (process.env.NODE_ENV === 'development') {
    if (steps.length < 2) {
      console.error('SwapStepper must have more than 2 steps.');
    }
  }
  return (
    <Stack sx={{ width: '100%' }} spacing={4}>
      <Stepper
        alternativeLabel
        activeStep={steps.length}
        connector={<SwapStepConnector />}
      >
        {steps.map((step) => (
          <SwapStep
            key={step.label + Math.random()}
            stepperLength={steps.length}
          >
            <SwapStepLabel
              StepIconComponent={StepIcon}
              optional={
                <div className="SwapStepLabel-optional">{step.sublabel}</div>
              }
            >
              {step.label}
            </SwapStepLabel>
          </SwapStep>
        ))}
      </Stepper>
    </Stack>
  );
}
