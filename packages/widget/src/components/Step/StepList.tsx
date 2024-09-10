import type { RouteExtended, TokenAmount } from '@lifi/sdk';
import { Fragment } from 'react';
import { StepDivider } from '../../components/StepDivider/StepDivider.js';
import type { WidgetSubvariant } from '../../types/widget.js';
import { Step } from './Step.js';

export const getStepList = (
  route?: RouteExtended,
  subvariant?: WidgetSubvariant,
) =>
  route?.steps.map((step, index, steps) => {
    const lastIndex = steps.length - 1;
    const fromToken: TokenAmount | undefined =
      index === 0
        ? {
            ...step.action.fromToken,
            amount: BigInt(step.action.fromAmount),
          }
        : undefined;
    let toToken: TokenAmount | undefined;
    let impactToken: TokenAmount | undefined;
    if (index === lastIndex) {
      toToken = {
        ...(step.execution?.toToken ?? step.action.toToken),
        amount: step.execution?.toAmount
          ? BigInt(step.execution.toAmount)
          : subvariant === 'custom'
            ? BigInt(route.toAmount)
            : BigInt(step.estimate.toAmount),
      };
      impactToken = {
        ...steps[0].action.fromToken,
        amount: BigInt(steps[0].action.fromAmount),
      };
    }
    const toAddress =
      index === lastIndex && route.fromAddress !== route.toAddress
        ? route.toAddress
        : undefined;
    return (
      <Fragment key={step.id}>
        <Step
          step={step}
          fromToken={fromToken}
          toToken={toToken}
          impactToken={impactToken}
          toAddress={toAddress}
        />
        {steps.length > 1 && index !== steps.length - 1 ? (
          <StepDivider />
        ) : null}
      </Fragment>
    );
  });
