import { Route, StepType } from '@lifinance/sdk';
import { formatTokenAmount } from '@lifinance/widget/utils/format';
import { Box, Skeleton, Stack as MuiStack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useChains, useSwapRoutes } from '../../hooks';
import { SwapRouteCard } from '../SwapRouteCard';

const parsedStepTypes: {
  [K in StepType]: string;
} = {
  lifi: 'Li.Fi Bridge via',
  cross: 'Bridge',
  swap: 'Dex',
};

const Stack = styled(MuiStack)(({ theme }) => ({
  alignItems: 'stretch',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  overflowX: 'auto',
  overflowY: 'hidden',
  padding: theme.spacing(2, 0),
}));

export const SwapRoute: React.FC = () => {
  const { t } = useTranslation();
  const { getChainById } = useChains();
  const { routes, isFetching, isFetched } = useSwapRoutes();
  const renderRoutesLoading = () => {
    return (
      // <Box
      //   sx={{
      //     py: 8,
      //     width: '100%',
      //     display: 'flex',
      //     justifyContent: 'center',
      //     alignItems: 'center',
      //   }}
      // >
      //   <AnimatedWaitIcon />
      //   <Typography variant="subtitle1" color="text.primary">
      //     {t('swap.requestingRoutes')}
      //   </Typography>
      // </Box>
      <Stack direction="row" sx={{ padding: '0 0 24px' }} spacing={2}>
        <Skeleton
          variant="rectangular"
          width={200}
          height={195}
          sx={{ borderRadius: 1 }}
        />
      </Stack>
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
    // <Box
    //   py={2}
    //   sx={{
    //     display: 'flex',
    //     flexDirection: 'column',
    //     flex: 1,
    //     justifyContent: 'flex-end',
    //   }}
    // >
    //   <SwapStepper
    //     steps={[
    //       {
    //         label: route.fromToken.symbol,
    //         sublabel: getChainById(route.fromChainId)!.name,
    //       },
    //       ...route.steps.map((step) => {
    //         return { label: parsedStepTypes[step.type], sublabel: step.tool };
    //       }),
    //       {
    //         label: route.toToken.symbol,
    //         sublabel: getChainById(route.toChainId)!.name,
    //       },
    //     ]}
    //   />
    //   <Box
    //     mt={2}
    //     sx={{
    //       display: 'flex',
    //       justifyContent: 'space-between',
    //       alignItems: 'center',
    //     }}
    //   >
    //     <Typography
    //       variant="subtitle1"
    //       color="text.secondary"
    //       sx={{ alignSelf: 'end' }}
    //     >
    //       {t(`swap.gas`)}
    //     </Typography>
    //     <Typography
    //       ml={2}
    //       variant="subtitle1"
    //       color="text.primary"
    //       sx={{ alignSelf: 'end' }}
    //     >
    //       {t(`swap.approximateCurrency`, { value: route.gasCostUSD })}
    //     </Typography>
    //   </Box>
    //   <Box
    //     sx={{
    //       display: 'flex',
    //       justifyContent: 'space-between',
    //       alignItems: 'center',
    //     }}
    //   >
    //     <Typography
    //       variant="subtitle1"
    //       color="text.secondary"
    //       sx={{ alignSelf: 'end' }}
    //     >
    //       {t(`swap.minutes`)}
    //     </Typography>
    //     <Typography
    //       ml={2}
    //       variant="subtitle1"
    //       color="text.primary"
    //       sx={{ alignSelf: 'end' }}
    //     >
    //       {`${(
    //         route.steps
    //           .map((step) => step.estimate.executionDuration)
    //           .reduce((cumulated, x) => cumulated + x) / 60
    //       ).toFixed(1)} min`}
    //     </Typography>
    //   </Box>
    // </Box>
    <Stack direction="row" sx={{ padding: '0 0 24px' }} spacing={2}>
      <SwapRouteCard
        width={200}
        amount={formatTokenAmount(route.toAmount, route.toToken.decimals)}
        token={route.toToken.name}
        gas={t(`swap.currency`, { value: route.gasCostUSD })}
        time={(
          route.steps
            .map((step) => step.estimate.executionDuration)
            .reduce((cumulated, x) => cumulated + x) / 60
        ).toFixed(0)}
        type="recommended"
        active
      />
    </Stack>
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
