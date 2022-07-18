import { Box } from '@mui/material';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { InsufficientGasOrFundsMessage } from '../../components/InsufficientGasOrFundsMessage';
import { SwapButton } from '../../components/SwapButton';
import { useRouteExecution } from '../../hooks';
import { StatusBottomSheet } from './StatusBottomSheet';
import { StepDivider } from './StepDivider';
import { StepItem } from './StepItem';
import { Button, Container } from './SwapPage.style';

export const SwapPage: React.FC = () => {
  const { t } = useTranslation();
  const { state }: any = useLocation();
  const navigate = useNavigate();
  const { route, status, executeRoute, restartRoute, removeRoute } =
    useRouteExecution(state?.routeId);

  const handleRemoveRoute = () => {
    removeRoute();
    navigate(-1);
  };

  const handleSwapClick = () => {
    if (status === 'idle') {
      executeRoute();
    }
    if (status === 'error') {
      restartRoute();
    }
  };

  // eslint-disable-next-line consistent-return
  const getSwapButtonText = () => {
    if (status === 'idle') {
      return t('button.startSwap');
    }
    if (status === 'error') {
      return t('button.restartSwap');
    }
  };

  return (
    <Container>
      {route?.steps.map((step, index, steps) => (
        <Fragment key={step.id}>
          <StepItem
            step={step}
            fromToken={
              index === 0
                ? { ...step.action.fromToken, amount: step.action.fromAmount }
                : undefined
            }
            toToken={
              index === steps.length - 1
                ? {
                    ...step.action.toToken,
                    amount: step.execution?.toAmount ?? step.estimate.toAmount,
                  }
                : undefined
            }
          />
          {steps.length > 1 && index !== steps.length - 1 ? (
            <StepDivider />
          ) : null}
        </Fragment>
      ))}
      {status === 'idle' ? <InsufficientGasOrFundsMessage mt={2} /> : null}
      {status === 'idle' || status === 'error' ? (
        <Box mt={2}>
          <SwapButton onClick={handleSwapClick} text={getSwapButtonText()} />
        </Box>
      ) : null}
      {status === 'error' ? (
        <Button
          variant="outlined"
          disableElevation
          fullWidth
          onClick={handleRemoveRoute}
        >
          {t('button.removeSwap')}
        </Button>
      ) : null}
      <StatusBottomSheet status={status} route={route} />
    </Container>
  );
};
