import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSwapExecutionContext } from '../../providers/SwapExecutionProvider';
import { StepItem } from './StepItem';

export const SwappingPage: React.FC = () => {
  const { t } = useTranslation();
  const { route } = useSwapExecutionContext();
  console.log('swapping update');

  return (
    <Container>
      {route?.steps.map((step, index, steps) => (
        <StepItem
          key={step.id}
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
      ))}
    </Container>
  );
};
