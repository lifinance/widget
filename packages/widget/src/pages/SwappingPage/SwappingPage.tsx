import { Fragment } from 'react';
import { useSwapExecutionContext } from '../../providers/SwapExecutionProvider';
import { StepDivider } from './StepDivider';
import { StepItem } from './StepItem';
import { Container } from './SwappingPage.style';

export const SwappingPage: React.FC = () => {
  const { route } = useSwapExecutionContext();
  return (
    <Container>
      {route?.steps.map((step, index, steps) => (
        <Fragment key={step.id}>
          <StepItem
            step={step}
            fromToken={
              index === 0
                ? { ...route.fromToken, amount: route.fromAmount }
                : undefined
            }
            toToken={
              index === steps.length - 1
                ? { ...route.toToken, amount: route.toAmount }
                : undefined
            }
          />
          {steps.length > 1 && index !== steps.length - 1 ? (
            <StepDivider />
          ) : null}
        </Fragment>
      ))}
    </Container>
  );
};
