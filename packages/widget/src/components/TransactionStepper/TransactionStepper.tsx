import { Step } from '@lifinance/sdk';
import { Box, Button, Stepper, Typography } from '@mui/material';
import { useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import {
  TransactionStepperConnector,
  TransactionStep,
  TransactionStepLabel,
  DoneStepperIcon,
} from './TransactionStepper.style';
import { Props, TransactionStepperProps } from './types';

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const RouteStepLabel: React.FC<Props> = ({
  children,
  active,
  action,
  error,
}) => {
  return (
    <TransactionStepLabel
      error={error}
      color={error ? 'error' : 'primary'}
      StepIconComponent={action ? DoneStepperIcon : undefined}
    >
      {children}
    </TransactionStepLabel>
  );
};

const LabelContent: React.FC<Props> = ({ children, active }) => {
  let sx;
  if (active) {
    sx = { position: 'absolute', left: 158, top: -12 };
  }
  return <Box sx={sx}>{children}</Box>;
};

const renderStep = (
  step: Step,
  index: number,
  t: TFunction<'translation', undefined>,
) => {
  const isSigning = false;
  const isWaiting = true;
  const isFailed = false;

  const SignButton = (
    <Button size="large" variant="contained">
      {t(`transaction.signPrompt`)}
    </Button>
  );

  const details = (
    <Typography>
      <u>{t(`transaction.txDetails`)}</u>
    </Typography>
  );

  const waitingText = (
    <Typography>
      4:34 / {(step.estimate.executionDuration / 60).toFixed(0)} •{' '}
      {capitalizeFirstLetter(step.tool)}
    </Typography>
  );

  return [
    <TransactionStep key={`${step.id}_action`}>
      <RouteStepLabel action active={isSigning} error={isFailed}>
        <LabelContent active={isSigning}>
          {isSigning ? SignButton : details}
        </LabelContent>
      </RouteStepLabel>
    </TransactionStep>,
    <TransactionStep key={`${step.id}_wait`}>
      <LabelContent active={isWaiting}>
        {isWaiting ? waitingText : undefined}
      </LabelContent>
    </TransactionStep>,

    <TransactionStep key={`${step.id}_action`}>
      <RouteStepLabel action active={isSigning} error={isFailed}>
        <LabelContent active={isSigning}>
          {isSigning ? SignButton : details}
        </LabelContent>
      </RouteStepLabel>
    </TransactionStep>,
    <TransactionStep key={`${step.id}_wait`}>
      <LabelContent active={isWaiting}>
        {isWaiting ? waitingText : undefined}
      </LabelContent>
    </TransactionStep>,

    <TransactionStep key={`${step.id}_action`}>
      <RouteStepLabel action active={isSigning} error={isFailed}>
        <LabelContent active={isSigning}>
          {isSigning ? SignButton : details}
        </LabelContent>
      </RouteStepLabel>
    </TransactionStep>,
    <TransactionStep key={`${step.id}_wait`}>
      <LabelContent active={isWaiting}>
        {isWaiting ? waitingText : undefined}
      </LabelContent>
    </TransactionStep>,
  ];
};

export const TransactionStepper: React.FC<TransactionStepperProps> = ({
  route,
}) => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState<number>(2);

  return (
    <Stepper
      activeStep={activeStep}
      orientation="vertical"
      connector={<TransactionStepperConnector />}
    >
      <TransactionStep key={-1} />
      {route.steps.map((step, index) => renderStep(step, index, t))}
      <TransactionStep key={route.steps.length}>
        <TransactionStepLabel StepIconComponent={DoneStepperIcon}>
          {(
            route.steps
              .map((step) => step.estimate.executionDuration)
              .reduce((cumulated, x) => cumulated + x) / 60
          ).toFixed(1)}{' '}
          min
        </TransactionStepLabel>
      </TransactionStep>
    </Stepper>
  );
};
