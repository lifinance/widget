import { Route } from '@lifi/sdk';
import { Fragment } from 'react';
import { StepDivider } from '../../components/StepDivider';
import { Step } from './Step';

export const getStepList = (route?: Route) =>
  route?.steps.map((step, index, steps) => {
    const lastIndex = steps.length - 1;
    const fromToken =
      index === 0
        ? { ...step.action.fromToken, amount: step.action.fromAmount }
        : undefined;
    const toToken =
      index === lastIndex
        ? {
            ...(step.execution?.toToken ?? step.action?.toToken),
            amount: step.execution?.toAmount ?? step.estimate.toAmount,
          }
        : undefined;
    return (
      <Fragment key={step.id}>
        <Step step={step} fromToken={fromToken} toToken={toToken} />
        {steps.length > 1 && index !== steps.length - 1 ? (
          <StepDivider />
        ) : null}
      </Fragment>
    );
  });
