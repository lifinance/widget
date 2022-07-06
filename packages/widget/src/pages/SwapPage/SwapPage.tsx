import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
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
    useRouteExecution(state.routeId as string);

  const handleRemoveRoute = () => {
    removeRoute();
    navigate(-1);
  };

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
      {status === 'idle' ? (
        <Button
          variant="contained"
          disableElevation
          fullWidth
          onClick={executeRoute}
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
          >
            {t('button.restartSwap')}
          </Button>
          <Button
            variant="outlined"
            disableElevation
            fullWidth
            onClick={handleRemoveRoute}
          >
            {t('button.removeSwap')}
          </Button>
        </>
      ) : null}
      <StatusBottomSheet status={status} route={route} />
    </Container>
  );
};
