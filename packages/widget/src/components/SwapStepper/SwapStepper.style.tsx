import { Step } from '@mui/material';
import StepConnector, {
  stepConnectorClasses,
} from '@mui/material/StepConnector';
import StepLabel, { stepLabelClasses } from '@mui/material/StepLabel';
import { styled } from '@mui/material/styles';

export const SwapStep = styled(Step, {
  shouldForwardProp: (prop) => prop !== 'stepperLength',
})<{ stepperLength: number }>(({ theme, stepperLength }) => ({
  paddingRight: 0,
  paddingLeft: 0,
  '&:first-of-type': {
    [`& .${stepLabelClasses.root}`]: {
      alignItems: 'flex-start',
    },
    [`& .${stepLabelClasses.root} .SwapStepLabel-optional`]: {
      textAlign: 'left',
    },
    [`& .${stepLabelClasses.label}.${stepLabelClasses.alternativeLabel}`]: {
      textAlign: 'left',
    },
  },
  '&:last-of-type': {
    [`& .${stepConnectorClasses.root}.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]:
      {
        borderColor: theme.palette.common.black,
      },
    [`& .${stepConnectorClasses.root}.${stepConnectorClasses.alternativeLabel}`]:
      {
        left:
          stepperLength > 2
            ? `${-100 / (stepperLength - 1) - 5 * stepperLength}%`
            : '-100%',
        right: 0,
      },
    [`& .${stepLabelClasses.root}`]: {
      alignItems: 'flex-end',
    },
    [`& .${stepLabelClasses.root} .SwapStepLabel-optional`]: {
      textAlign: 'right',
    },
    [`& .${stepLabelClasses.label}.${stepLabelClasses.alternativeLabel}`]: {
      textAlign: 'right',
    },
  },
  ...(stepperLength > 2 && {
    [`&:nth-of-type(2)`]: {
      [`& .${stepConnectorClasses.root}.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]:
        {
          borderColor: theme.palette.common.black,
        },
      [`& .${stepConnectorClasses.root}.${stepConnectorClasses.alternativeLabel}`]:
        {
          left: '-100%',
          right: `${100 - 100 / (stepperLength - 1) - 5 * stepperLength}%`,
        },
      [`& .${stepLabelClasses.iconContainer}>div`]: {
        backgroundColor: theme.palette.primary.main,
        borderRadius: '50%',
      },
      [`& .${stepLabelClasses.root} .SwapStepLabel-optional`]: {
        color: theme.palette.primary.main,
      },
      [`& .${stepConnectorClasses.completed}.${stepLabelClasses.label}`]: {
        color: theme.palette.primary.main,
      },
    },
    [`&:nth-last-of-type(n+2):not(:first-of-type):not(:nth-of-type(2))`]: {
      [`& .${stepConnectorClasses.root}.${stepConnectorClasses.alternativeLabel}`]:
        {
          left: `${-100 + 100 / (stepperLength - 1) + 5 * stepperLength}%`,
          right: `${100 / (stepperLength - 1)}%`,
        },
      [`& .${stepLabelClasses.iconContainer}>div`]: {
        backgroundColor: theme.palette.primary.main,
        borderRadius: '50%',
      },
      [`& .${stepLabelClasses.root} .SwapStepLabel-optional`]: {
        color: theme.palette.primary.main,
      },
      [`& .${stepConnectorClasses.completed}.${stepLabelClasses.label}`]: {
        color: theme.palette.primary.main,
      },
    },
  }),
}));

export const SwapStepConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 50,
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
    borderTopWidth: 1,
    borderRadius: 1,
  },
}));

export const SwapStepLabel = styled(StepLabel)(({ theme }) => ({
  [`&.${stepLabelClasses.alternativeLabel}`]: {
    flexDirection: 'column-reverse',
  },
  [`& .${stepLabelClasses.label}.${stepLabelClasses.alternativeLabel}`]: {
    margin: 0,
  },
  [`& .${stepLabelClasses.labelContainer}`]: {
    height: 40,
  },
  [`& .SwapStepLabel-optional`]: {
    textAlign: 'center',
    fontSize: '0.875rem',
  },
}));

export const SwapStepIcon = styled('div')(({ theme }) => ({
  margin: '4px 0',
  width: 13,
  height: 13,
  backgroundColor: theme.palette.common.black,
  zIndex: 1,
}));
