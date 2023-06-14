/* eslint-disable react/no-array-index-key */
import type { Route } from '@lifi/sdk';
import { Collapse, Grow, Stack, Typography } from '@mui/material';
import { useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMatch, useNavigate } from 'react-router-dom';
import { useRoutes } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import { useSetExecutableRoute } from '../../stores';
import { navigationRoutes } from '../../utils';
import { ProgressToNextUpdate } from '../ProgressToNextUpdate';
import { RouteCard, RouteCardSkeleton, RouteNotFoundCard } from '../RouteCard';
import {
  CollapseContainer,
  Container,
  Header,
  ScrollableContainer,
} from './RoutesExpanded.style';

const timeout = { enter: 225, exit: 225, appear: 0 };

export const RoutesExpanded = () => {
  const element = useMatch('/');
  return (
    <CollapseContainer>
      <Collapse timeout={timeout} in={!!element} orientation="horizontal">
        <Grow timeout={timeout} in={!!element} mountOnEnter unmountOnExit>
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
  const { isValid, isValidating } = useFormState();
  const {
    routes,
    isLoading,
    isFetching,
    isFetched,
    dataUpdatedAt,
    refetchTime,
    refetch,
  } = useRoutes();

  const currentRoute = routes?.[0];

  const handleRouteClick = (route: Route) => {
    if (isValid && !isValidating) {
      setExecutableRoute(route);
      navigate(navigationRoutes.transactionExecution, {
        state: { routeId: route.id },
      });
    }
  };

  const expanded = Boolean(
    currentRoute || isLoading || isFetching || isFetched,
  );

  const routeNotFound = !currentRoute && !isLoading && !isFetching && expanded;

  return (
    <Collapse timeout={timeout.enter} in={expanded} orientation="horizontal">
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
            <Stack
              direction="column"
              spacing={2}
              flex={1}
              paddingX={3}
              paddingBottom={3}
            >
              {routeNotFound ? (
                <RouteNotFoundCard />
              ) : isLoading || (isFetching && !routes?.length) ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <RouteCardSkeleton key={index} />
                ))
              ) : (
                routes?.map((route: Route, index: number) => (
                  <RouteCard
                    key={route.id}
                    route={route}
                    onClick={() => handleRouteClick(route)}
                    active={index === 0}
                    expanded={routes?.length <= 2}
                  />
                ))
              )}
            </Stack>
          </ScrollableContainer>
        </Container>
      </Grow>
    </Collapse>
  );
};
