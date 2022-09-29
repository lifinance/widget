/* eslint-disable react/no-array-index-key */
import type { Route } from '@lifi/sdk';
import { Collapse, Grow, Stack, Typography } from '@mui/material';
import { useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSwapRoutes } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import { useSetExecutableRoute } from '../../stores';
import { navigationRoutes, navigationRoutesValues } from '../../utils';
import { ProgressToNextUpdate } from '../ProgressToNextUpdate';
import {
  SwapRouteCard,
  SwapRouteCardSkeleton,
  SwapRouteNotFoundCard,
} from '../SwapRouteCard';
import {
  CollapseContainer,
  Container,
  Header,
  ScrollableContainer,
} from './SwapRoutes.style';
import { useSetSelectedRoute } from './useSetSelectedRoute';

export const SwapRoutesExpanded = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setExecutableRoute = useSetExecutableRoute();
  const { containerStyle } = useWidgetConfig();
  const { isValid, isValidating } = useFormState();
  const {
    routes,
    isLoading,
    isFetching,
    isFetched,
    dataUpdatedAt,
    refetchTime,
    refetch,
  } = useSwapRoutes();

  const currentRoute = routes?.[0];

  useSetSelectedRoute(currentRoute, isFetching);

  const { pathname } = useLocation();
  const cleanedPathname = pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;
  const path = cleanedPathname.substring(cleanedPathname.lastIndexOf('/') + 1);
  const hasPath = navigationRoutesValues.includes(path);

  const handleRouteClick = (route: Route) => {
    if (isValid && !isValidating) {
      setExecutableRoute(route);
      navigate(navigationRoutes.swapExecution, {
        state: { routeId: route.id },
      });
    }
  };

  const expanded =
    Boolean(currentRoute || isLoading || isFetching || isFetched) && !hasPath;

  const routeNotFound = !currentRoute && !isLoading && !isFetching && expanded;

  return (
    <CollapseContainer>
      <Collapse appear timeout={225} in={expanded} orientation="horizontal">
        <Grow appear timeout={225} in={expanded}>
          <Container sx={containerStyle} enableColorScheme>
            <ScrollableContainer>
              <Header>
                <Typography fontSize={18} fontWeight="700" flex={1} noWrap>
                  {t('swap.routes')}
                </Typography>
                <ProgressToNextUpdate
                  updatedAt={dataUpdatedAt || new Date().getTime()}
                  timeToUpdate={refetchTime}
                  isLoading={isFetching}
                  onClick={() => refetch()}
                  sx={{ marginRight: -1 }}
                />
              </Header>
              <Stack
                direction="column"
                spacing={2}
                flex={1}
                paddingX={3}
                paddingBottom={3}
              >
                {routeNotFound ? (
                  <SwapRouteNotFoundCard />
                ) : isLoading || isFetching ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <SwapRouteCardSkeleton key={index} variant="stretched" />
                  ))
                ) : (
                  routes?.map((route: Route, index: number) => (
                    <SwapRouteCard
                      key={route.id}
                      route={route}
                      onClick={() => handleRouteClick(route)}
                      active={index === 0}
                      variant="stretched"
                      expanded={routes?.length <= 2}
                    />
                  ))
                )}
              </Stack>
            </ScrollableContainer>
          </Container>
        </Grow>
      </Collapse>
    </CollapseContainer>
  );
};
