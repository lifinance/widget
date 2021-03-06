import { Box, Button } from '@mui/material';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { GasSufficiencyMessage } from '../../components/GasSufficiencyMessage';
import { Step } from '../../components/Step';
import { StepDivider } from '../../components/StepDivider';
import { SwapButton } from '../../components/SwapButton';
import { useRouteExecution } from '../../hooks';
import { StatusBottomSheet } from './StatusBottomSheet';
import { Container } from './SwapPage.style';

export const SwapPage: React.FC = () => {
  const { t } = useTranslation();
  const { state }: any = useLocation();
  const navigate = useNavigate();
  const { route, status, executeRoute, restartRoute, deleteRoute } =
    useRouteExecution(state?.routeId);

  const handleRemoveRoute = () => {
    navigate(-1);
    deleteRoute();
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
          <Step
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
      {status === 'idle' ? (
        <GasSufficiencyMessage route={route} mt={2} />
      ) : null}
      {status === 'idle' || status === 'error' ? (
        <Box mt={2}>
          <SwapButton
            text={getSwapButtonText()}
            onClick={handleSwapClick}
            currentRoute={route}
          />
        </Box>
      ) : null}
      {status === 'error' ? (
        <Box mt={2}>
          <Button variant="outlined" onClick={handleRemoveRoute} fullWidth>
            {t('button.removeSwap')}
          </Button>
        </Box>
      ) : null}
      {route && status ? (
        <StatusBottomSheet status={status} route={route} />
      ) : null}
    </Container>
  );
};
