/* eslint-disable react/no-array-index-key */
import type { Route } from '@lifi/sdk';
import type { BoxProps } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ProgressToNextUpdate } from '../../components/ProgressToNextUpdate.js';
import { RouteCard } from '../../components/RouteCard/RouteCard.js';
import { RouteCardSkeleton } from '../../components/RouteCard/RouteCardSkeleton.js';
import { RouteNotFoundCard } from '../../components/RouteCard/RouteNotFoundCard.js';
import { useAccount } from '../../hooks/useAccount.js';
import { useHeader } from '../../hooks/useHeader.js';
import { useNavigateBack } from '../../hooks/useNavigateBack.js';
import { useRoutes } from '../../hooks/useRoutes.js';
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js';
import { useFieldValues } from '../../stores/form/useFieldValues.js';
import { useSetExecutableRoute } from '../../stores/routes/useSetExecutableRoute.js';
import { navigationRoutes } from '../../utils/navigationRoutes.js';
import { Stack } from './RoutesPage.style.js';

export const RoutesPage: React.FC<BoxProps> = () => {
  const { navigate } = useNavigateBack();
  const setExecutableRoute = useSetExecutableRoute();
  const {
    routes,
    isLoading,
    isFetching,
    dataUpdatedAt,
    refetchTime,
    refetch,
    fromChain,
  } = useRoutes();
  const { account } = useAccount({ chainType: fromChain?.chainType });
  const [toAddress] = useFieldValues('toAddress');
  const { requiredToAddress } = useToAddressRequirements();

  const { t } = useTranslation();

  const headerAction = useMemo(
    () => (
      <ProgressToNextUpdate
        updatedAt={dataUpdatedAt || new Date().getTime()}
        timeToUpdate={refetchTime}
        isLoading={isFetching}
        onClick={() => refetch()}
        sx={{ marginRight: -1 }}
        size="medium"
      />
    ),
    [dataUpdatedAt, isFetching, refetch, refetchTime],
  );

  useHeader(t(`header.youGet`), headerAction);

  const handleRouteClick = (route: Route) => {
    setExecutableRoute(route);
    navigate(navigationRoutes.transactionExecution, {
      state: { routeId: route.id },
    });
  };

  const routeNotFound = !routes?.length && !isLoading && !isFetching;

  const toAddressUnsatisfied = routes?.[0] && requiredToAddress && !toAddress;
  const allowInteraction = account.isConnected && !toAddressUnsatisfied;

  return (
    <Stack direction="column" spacing={2} flex={1}>
      {routeNotFound ? (
        <RouteNotFoundCard />
      ) : isLoading ? (
        Array.from({ length: 3 }).map((_, index) => (
          <RouteCardSkeleton key={index} />
        ))
      ) : (
        routes?.map((route: Route, index: number) => (
          <RouteCard
            key={index}
            route={route}
            onClick={
              allowInteraction ? () => handleRouteClick(route) : undefined
            }
            active={index === 0}
            expanded={routes?.length === 1}
          />
        ))
      )}
    </Stack>
  );
};
