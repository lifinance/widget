/* eslint-disable react/no-array-index-key */
import type { Route } from '@lifi/sdk';
import { Collapse, Grow, Stack, Typography } from '@mui/material';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { RouteObject } from 'react-router-dom';
import { useRoutes as useDOMRoutes, useNavigate } from 'react-router-dom';
import { useRoutes } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import { useSetExecutableRoute } from '../../stores';
import { navigationRoutes } from '../../utils';
import { PageContainer } from '../PageContainer';
import { ProgressToNextUpdate } from '../ProgressToNextUpdate';
import { RouteCard, RouteCardSkeleton, RouteNotFoundCard } from '../RouteCard';
import {
  CollapseContainer,
  Container,
  Header,
  ScrollableContainer,
} from './RoutesExpanded.style';

const timeout = { enter: 225, exit: 225, appear: 0 };

const routes: RouteObject[] = [
  {
    path: '/',
    element: true,
  },
];

export const RoutesExpanded = () => {
  const match = useDOMRoutes(routes);

  return (
    <CollapseContainer>
      <Collapse timeout={timeout} in={!!match} orientation="horizontal">
        <Grow timeout={timeout} in={!!match} mountOnEnter unmountOnExit>
          <div>
            <RoutesExpandedElement />
          </div>
        </Grow>
      </Collapse>
    </CollapseContainer>
  );
};

export const RoutesExpandedElement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setExecutableRoute = useSetExecutableRoute();
  const { subvariant, containerStyle } = useWidgetConfig();
  const routesRef = useRef<Route[]>();
  const routesActiveRef = useRef(false);
  const {
    routes,
    isLoading,
    isFetching,
    isFetched,
    dataUpdatedAt,
    refetchTime,
    refetch,
  } = useRoutes();

  const handleRouteClick = (route: Route) => {
    setExecutableRoute(route);
    navigate(navigationRoutes.transactionExecution, {
      state: { routeId: route.id },
    });
  };

  const onExit = () => {
    // Clean routes cache on exit
    routesRef.current = undefined;
  };

  // We cache routes results in ref for a better exit animation
  if (routesRef.current && !routes?.length) {
    routesActiveRef.current = false;
  } else {
    routesRef.current = routes;
    routesActiveRef.current = Boolean(routes?.length);
  }

  const currentRoute = routesRef.current?.[0];

  const expanded = Boolean(
    routesActiveRef.current || isLoading || isFetching || isFetched,
  );

  const routeNotFound = !currentRoute && !isLoading && !isFetching && expanded;

  return (
    <Collapse
      timeout={timeout.enter}
      in={expanded}
      orientation="horizontal"
      onExited={onExit}
    >
      <Grow timeout={timeout.enter} in={expanded} mountOnEnter unmountOnExit>
        <Container sx={containerStyle} enableColorScheme>
          <ScrollableContainer>
            <Header>
              <Typography fontSize={18} fontWeight="700" flex={1} noWrap>
                {subvariant === 'nft'
                  ? t('main.fromAmount')
                  : t('header.youGet')}
              </Typography>
              <ProgressToNextUpdate
                updatedAt={dataUpdatedAt || new Date().getTime()}
                timeToUpdate={refetchTime}
                isLoading={isFetching}
                onClick={() => refetch()}
                sx={{ marginRight: -1 }}
              />
            </Header>
            <PageContainer>
              <Stack direction="column" spacing={2} flex={1} paddingBottom={3}>
                {routeNotFound ? (
                  <RouteNotFoundCard />
                ) : isLoading || (isFetching && !routesRef.current?.length) ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <RouteCardSkeleton key={index} />
                  ))
                ) : (
                  routesRef.current?.map((route: Route, index: number) => (
                    <RouteCard
                      key={index}
                      route={route}
                      onClick={() => handleRouteClick(route)}
                      active={index === 0}
                      expanded={routesRef.current?.length === 1}
                    />
                  ))
                )}
              </Stack>
            </PageContainer>
          </ScrollableContainer>
        </Container>
      </Grow>
    </Collapse>
  );
};
