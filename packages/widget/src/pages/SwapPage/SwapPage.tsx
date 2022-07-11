import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { InsufficientGasOrFundsMessage } from '../../components/InsufficientGasOrFundsMessage';
import { useHasSufficientBalance, useRouteExecution } from '../../hooks';
import { StatusBottomSheet } from './StatusBottomSheet';
import { StepDivider } from './StepDivider';
import { StepItem } from './StepItem';
import { Button, Container } from './SwapPage.style';

export const SwapPage: React.FC = () => {
  const { t } = useTranslation();
  const { state }: any = useLocation();
  const navigate = useNavigate();
  const { hasGasOnStartChain, hasGasOnCrossChain, hasSufficientBalance } =
    useHasSufficientBalance();
  const { route, status, executeRoute, restartRoute, removeRoute } =
    useRouteExecution(state.routeId as string);

  const handleRemoveRoute = () => {
    removeRoute();
    navigate(-1);
  };

  const isDisabled =
    !hasSufficientBalance || !hasGasOnStartChain || !hasGasOnCrossChain;

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
      <InsufficientGasOrFundsMessage mt={2} />
      {status === 'idle' ? (
        <Button
          variant="contained"
          disableElevation
          fullWidth
          onClick={executeRoute}
          disabled={isDisabled}
        >
          {t('button.startSwap')}
        </Button>
      ) : null}
      {status === 'error' ? (
        <>
          <Button
            variant="contained"
            disableElevation
            fullWidth
            onClick={restartRoute}
            disabled={isDisabled}
          >
            {t('button.restartSwap')}
          </Button>
          <Button
            variant="outlined"
            disableElevation
            fullWidth
            onClick={handleRemoveRoute}
            disabled={isDisabled}
          >
            {t('button.removeSwap')}
          </Button>
        </>
      ) : null}
      <StatusBottomSheet status={status} route={route} />
    </Container>
  );
};
