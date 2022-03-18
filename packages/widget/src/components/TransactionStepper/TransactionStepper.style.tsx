import StepConnector, {
  stepConnectorClasses,
} from '@mui/material/StepConnector';
import Step, { stepClasses } from '@mui/material/Step';
import StepLabel, { stepLabelClasses } from '@mui/material/StepLabel';
import { styled } from '@mui/system';
import { StepIconProps, Theme } from '@mui/material';
import { SignIcon } from '@lifinance/widget/components/TransactionStepper/icons/signIcon';
import { TickIcon } from './icons/tickIcon';

const MIN_STEPPER_LINE_HEIGHT = 104;

interface StepperIconBubbleOptions {
  active?: boolean;
  completed?: boolean;
  error?: boolean;
}

export const TransactionStep = styled(Step)(({ theme }) => ({
  position: 'relative',
}));

export const TransactionStepLabel = styled(StepLabel)(({ theme }) => ({
  [`&.${stepLabelClasses.root}`]: {
    margin: '-20px 0 -2px -3px',
    padding: 0,
  },
}));

export const TransactionStepperConnector = styled(StepConnector)(
  ({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {},
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        background: theme.palette.primary.main,
      },
      [`& .${stepConnectorClasses.line}:before`]: {
        content: '" "',
        position: 'absolute',
        height: MIN_STEPPER_LINE_HEIGHT,
        top: 0,
        left: -64,
        width: 64,
        // background: `linear-gradient(0deg, ${theme.palette.primary.main} 0%, rgba(255,255,255,1) 100%)`,
        background: `linear-gradient(0deg, ${theme.palette.primary.main} 0%, rgba(255,255,255,0) 95%)`,
        opacity: 0.3,
      },
      [`& .${stepConnectorClasses.line}:after`]: {
        content: '" "',
        position: 'absolute',
        bottom: 0,
        left: -64,
        height: 1.5,
        width: '160px',

        background: theme.palette.primary.main,

        // backgroundColor:
        //   theme.palette.mode === 'dark' ? theme.palette.grey[200] : '#eaeaf0',
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        background: theme.palette.primary.main,
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      position: 'relative',
      height: MIN_STEPPER_LINE_HEIGHT,
      width: 10,

      border: 0,
      backgroundColor:
        theme.palette.mode === 'dark' ? theme.palette.grey[200] : '#eaeaf0',
    },
  }),
);

export const StepperIconBubble = styled('div')(
  ({
    theme,
    options,
  }: {
    theme?: Theme;
    options: StepperIconBubbleOptions;
  }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 30,
    zIndex: 999,
    boxShadow: '0px 4px 6px -8px rgba(0, 0, 0, 0.1)',
    boxSizing: 'border-box',

    border: options.completed
      ? '1px solid white'
      : options.active
      ? '2px solid #3F49E1'
      : '1px solid rgba(0, 0, 0, 0.05)',
    color: options.completed ? 'white' : options.active ? '#3F49E1' : 'black',
    background: options.completed ? '#3F49E1' : 'white',
  }),
);

export function StepperIcons(props: StepIconProps) {
  const { active, completed, error } = props;

  return (
    <StepperIconBubble options={{ active, completed, error }}>
      <SignIcon completed={completed} />
    </StepperIconBubble>
  );
}

export function DoneStepperIcon(props: StepIconProps) {
  const { active, completed, error } = props;
  return (
    <StepperIconBubble options={{ active, completed, error }}>
      <TickIcon completed={completed} />
    </StepperIconBubble>
  );
}
