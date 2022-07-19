import {
  ArrowForward as ArrowForwardIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
} from '@mui/icons-material';
import { Box, BoxProps, Stack } from '@mui/material';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useExecutingRoutes } from '../../stores';
import { navigationRoutes } from '../../utils';
import { CardTitle } from '../Card';
import { TokenAvatar, TokenAvatarGroup } from '../TokenAvatar';
import { Card, RouteCard } from './SwapInProgress.style';

export const SwapInProgress: React.FC<BoxProps> = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const executingRoutes = useExecutingRoutes();

  const handleCardClick = useCallback(
    (routeId: string) => {
      navigate(navigationRoutes.swap, { state: { routeId } });
    },
    [navigate],
  );

  if (!executingRoutes?.length) {
    return null;
  }

  return (
    <Card {...props}>
      <CardTitle>{t('swap.inProgress')}</CardTitle>
      <Stack spacing={2} py={2}>
        {executingRoutes.map(({ route, status }) => (
          <RouteCard
            key={route.id}
            onClick={() => handleCardClick(route.id)}
            avatar={
              <TokenAvatarGroup total={2}>
                <TokenAvatar token={route.fromToken} />
                <TokenAvatar token={route.toToken} />
              </TokenAvatarGroup>
            }
            action={<KeyboardArrowRightIcon />}
            title={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {route.fromToken.symbol}
                <ArrowForwardIcon fontSize="small" sx={{ paddingX: 0.5 }} />
                {route.toToken.symbol}
              </Box>
            }
          />
        ))}
      </Stack>
    </Card>
  );
};
