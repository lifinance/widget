import type { BoxProps } from '@mui/material';
import { Box, Button, Collapse, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useRoutes, useSettingMonitor } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import { navigationRoutes, formatSlippage } from '../../utils';
import { Card, CardTitle } from '../Card';
import { ProgressToNextUpdate } from '../ProgressToNextUpdate';
import { RouteCard, RouteCardSkeleton, RouteNotFoundCard } from '../RouteCard';
import PercentIcon from '@mui/icons-material/Percent';
import { SlippageSettings } from '../../pages/SettingsPage/SlippageSettings';

export const Routes: React.FC<BoxProps> = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { subvariant, useRecommendedRoute } = useWidgetConfig();
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
    <>
      {isLoading ? (
        <Card {...props}>
          <Box p={2}>
            <RouteCardSkeleton variant="cardless" />
          </Box>
        </Card>
      ) : !currentRoute ? (
        <Card {...props}>
          <Box p={2}>
            <RouteNotFoundCard />
          </Box>
        </Card>
      ) : (
        <>
          <Card {...props}>
            {/* <CardTitle>
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
            /> */}

            <Box p={2}>
              <RouteCard route={currentRoute} variant="cardless" active />

              {/* <Collapse
                timeout={225}
                in={showAll}
                unmountOnExit
                mountOnEnter
                appear
              >
                <Box mt={2}>
                  <Button onClick={handleCardClick} fullWidth>
                    {t('button.showAll')}
                  </Button>
                </Box>
              </Collapse> */}
            </Box>
          </Card>

          <Card {...props}>
            <Box p={2}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <Tooltip title="HELLO" placement="top" enterDelay={400} arrow>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      width: 'max-content',
                    }}
                  >
                    <PercentIcon />
                    <div style={{ fontWeight: 600 }}>
                      {t(`settings.slippage`)}
                    </div>
                  </div>
                </Tooltip>
                <SlippageSettings />
              </div>
            </Box>
          </Card>
        </>
      )}
    </>
  );
};
