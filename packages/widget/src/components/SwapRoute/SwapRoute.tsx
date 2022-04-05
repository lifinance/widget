import { Route, StepType } from '@lifinance/sdk';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useChains, useSwapRoutes } from '../../hooks';
import { SwapStepper } from '../SwapStepper';
import { AnimatedWaitIcon } from './SwapRoute.style';

const parsedStepTypes: {
  [K in StepType]: string;
} = {
  lifi: 'Li.Fi Bridge via',
  cross: 'Bridge',
  swap: 'Dex',
};

export const SwapRoute: React.FC = () => {
  const { t } = useTranslation();
  const { getChainById } = useChains();
  const { routes, isFetching, isFetched } = useSwapRoutes();

  const renderRoutesLoading = () => {
    return (
      <Box
        sx={{
          py: 8,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AnimatedWaitIcon />
        <Typography variant="subtitle1" color="text.primary">
          {t('swap.requestingRoutes')}
        </Typography>
      </Box>
    );
  };

  const renderNoRoutes = () => {
    return (
      <Box sx={{ py: 8, width: '100%' }}>
        <Typography
          variant="subtitle1"
          color="text.primary"
          sx={{ textAlign: 'center' }}
        >
          No Routes
        </Typography>
      </Box>
    );
  };

  const renderRouteDisplay = (route: Route) => (
    <Box py={2}>
      <SwapStepper
        steps={[
          {
            label: route.fromToken.symbol,
            sublabel: getChainById(route.fromChainId)!.name,
          },
          ...route.steps.map((step) => {
            return { label: parsedStepTypes[step.type], sublabel: step.tool };
          }),
          {
            label: route.toToken.symbol,
            sublabel: getChainById(route.toChainId)!.name,
          },
        ]}
      />
      <Box
        mt={2}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ alignSelf: 'end' }}
        >
          {t(`swap.gas`)}
        </Typography>
        <Typography
          ml={2}
          variant="subtitle1"
          color="text.primary"
          sx={{ alignSelf: 'end' }}
        >
          {t(`swap.price`, { price: route.gasCostUSD })}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ alignSelf: 'end' }}
        >
          {t(`swap.waitingTime`)}
        </Typography>
        <Typography
          ml={2}
          variant="subtitle1"
          color="text.primary"
          sx={{ alignSelf: 'end' }}
        >
          {`${(
            route.steps
              .map((step) => step.estimate.executionDuration)
              .reduce((cumulated, x) => cumulated + x) / 60
          ).toFixed(1)} min`}
        </Typography>
      </Box>
    </Box>
  );

  if (routes && routes.length > 0) {
    return renderRouteDisplay(routes[0]);
  }
  if (routes && routes.length > 0 && isFetched) {
    return renderNoRoutes();
  }
  if (isFetching) {
    return renderRoutesLoading();
  }

  // TODO: remove after upgrading to react 18 types.
  return null;
};
