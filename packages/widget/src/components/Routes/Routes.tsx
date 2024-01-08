import type { BoxProps } from '@mui/material';
import { Box, Button, Collapse } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useRequiredToAddress, useRoutes } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import { useFieldValues } from '../../stores';
import { navigationRoutes } from '../../utils';
import { Card, CardTitle } from '../Card';
import { ProgressToNextUpdate } from '../ProgressToNextUpdate';
import { RouteCard, RouteCardSkeleton, RouteNotFoundCard } from '../RouteCard';

export const Routes: React.FC<BoxProps> = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { subvariant, useRecommendedRoute } = useWidgetConfig();
  const [toAddress] = useFieldValues('toAddress');
  const requiredToAddress = useRequiredToAddress();
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

  if (!currentRoute && !isLoading && !isFetching && !isFetched) {
    return null;
  }

  const handleCardClick = () => {
    navigate(navigationRoutes.routes);
  };

  const routeNotFound = !currentRoute && !isLoading && !isFetching;
  const onlyRecommendedRoute = subvariant === 'refuel' || useRecommendedRoute;
  const showAll =
    !onlyRecommendedRoute && !routeNotFound && (routes?.length ?? 0) > 1;

  return (
    <Card {...props}>
      <CardTitle>
        {subvariant === 'nft' ? t('main.fromAmount') : t('header.youGet')}
      </CardTitle>
      <ProgressToNextUpdate
        updatedAt={dataUpdatedAt || new Date().getTime()}
        timeToUpdate={refetchTime}
        isLoading={isFetching}
        onClick={() => refetch()}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
        }}
      />
      <Box p={2}>
        {isLoading ? (
          <RouteCardSkeleton variant="cardless" />
        ) : !currentRoute ? (
          <RouteNotFoundCard />
        ) : (
          <RouteCard route={currentRoute} variant="cardless" active />
        )}

        <Collapse timeout={225} in={showAll} unmountOnExit mountOnEnter appear>
          <Box mt={2}>
            <Button
              onClick={handleCardClick}
              // TODO: Question: does this look it should be enough in place of isValid?
              //  should also check is toAddress is touched?
              disabled={requiredToAddress && !toAddress}
              fullWidth
            >
              {t('button.showAll')}
            </Button>
          </Box>
        </Collapse>
      </Box>
    </Card>
  );
};
