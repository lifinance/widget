/* eslint-disable react/no-array-index-key */
import { Route } from '@lifi/sdk';
import { BoxProps, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SwapRouteCard } from '../../components/SwapRouteCard';
import { useSwapRoutes } from '../../hooks';
import { useCurrentRoute, useSetExecutableRoute } from '../../stores';
import { routes } from '../../utils/routes';
import { Stack } from './SwapRoutesPage.style';

export const SwapRoutesPage: React.FC<BoxProps> = () => {
  const navigate = useNavigate();
  const { routes: swapRoutes, isLoading, isFetching } = useSwapRoutes();
  const [currentRoute] = useCurrentRoute();
  const setExecutableRoute = useSetExecutableRoute();

  if (!swapRoutes?.length && !isLoading && !isFetching) {
    // TODO: make no routes message
    return null;
  }

  const handleRouteClick = (route: Route) => {
    setExecutableRoute(route);
    navigate(routes.swap, { state: { routeId: route.id }, replace: true });
  };

  // A route for this transaction does not exist yet possibly due to liquidity issues or because the amount of tokens you are sending is below the bridge minimum amount.
  // Please try again later or change the tokens you intend to swap.
  // If the problem persists, come to our Discord and leave a message in the support channel.

  return (
    <Stack direction="column" spacing={2}>
      {isLoading || isFetching
        ? Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width="100%"
              height={196}
              sx={{ borderRadius: 1 }}
            />
          ))
        : swapRoutes?.map((route, index) => (
            <SwapRouteCard
              key={route.id}
              route={route}
              active={currentRoute?.id === route.id}
              onClick={() => handleRouteClick(route)}
            />
          ))}
    </Stack>
  );
};
