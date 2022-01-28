import { Step, Stepper } from '@mui/material';
import Stack from '@mui/material/Stack';
import StepConnector, {
  stepConnectorClasses,
} from '@mui/material/StepConnector';
import StepLabel, { stepLabelClasses } from '@mui/material/StepLabel';
import { styled } from '@mui/material/styles';

const SwapStep = styled(Step)(({ theme }) => ({
  [`&:nth-of-type(2) .${stepConnectorClasses.root}.${stepConnectorClasses.completed} .${stepConnectorClasses.line},
  &:last-of-type .${stepConnectorClasses.root}.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]:
    {
      borderColor: theme.palette.common.black,
    },
  [`&:nth-of-type(2) .${stepLabelClasses.iconContainer}>div,
  &:nth-last-of-type(2) .${stepLabelClasses.iconContainer}>div`]: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: '50%',
  },
}));

const SwapStepConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 50,
    left: '-50%',
    right: '50%',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.common.black,
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const SwapStepLabel = styled(StepLabel)(({ theme }) => ({
  [`&.${stepLabelClasses.alternativeLabel}`]: {
    flexDirection: 'column-reverse',
  },
  [`& .${stepLabelClasses.label}.${stepLabelClasses.alternativeLabel}`]: {
    margin: 0,
  },
  [`& .SwapStepLabel-optional`]: {
    textAlign: 'center',
  },
}));

const SwapStepIcon = styled('div')(({ theme }) => ({
  margin: '4px 0',
  width: 13,
  height: 13,
  backgroundColor: theme.palette.common.black,
  zIndex: 1,
}));

const steps = ['CAKE', 'Anyswap', 'Solana', 'AAVE'];

export function SwapStepper() {
  return (
    <Stack sx={{ width: '100%' }} spacing={4}>
      <Stepper
        alternativeLabel
        activeStep={steps.length}
        connector={<SwapStepConnector />}
      >
        {steps.map((label) => (
          <SwapStep key={label}>
            <SwapStepLabel
              StepIconComponent={SwapStepIcon}
              optional={<div className="SwapStepLabel-optional">{label}</div>}
            >
              {label}
            </SwapStepLabel>
          </SwapStep>
        ))}
      </Stepper>
    </Stack>
  );
}
