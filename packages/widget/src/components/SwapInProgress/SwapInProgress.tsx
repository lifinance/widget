import {
  ArrowForward as ArrowForwardIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
} from '@mui/icons-material';
import { Avatar, AvatarGroup, Box, BoxProps, Stack } from '@mui/material';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useExecutingRoutes } from '../../hooks';
import { routes } from '../../utils/routes';
import { CardTitle } from '../Card';
import { Card, RouteCard } from './SwapInProgress.style';

export const SwapInProgress: React.FC<BoxProps> = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const executingRoutes = useExecutingRoutes();

  const handleCardClick = useCallback(
    (routeId: string) => {
      navigate(routes.swap, { state: { routeId } });
    },
    [navigate],
  );

  if (!executingRoutes?.length) {
    return null;
  }

  return (
    <Card {...props}>
      <CardTitle>Swaps in progress</CardTitle>
      <Stack spacing={2} py={2}>
        {executingRoutes.map(({ route, status }) => (
          <RouteCard
            key={route.id}
            onClick={() => handleCardClick(route.id)}
            avatar={
              <AvatarGroup total={2}>
                <Avatar
                  src={route.fromToken.logoURI}
                  alt={route.fromToken.symbol}
                >
                  {route.fromToken.symbol[0]}
                </Avatar>
                <Avatar src={route.toToken.logoURI} alt={route.toToken.symbol}>
                  {route.toToken.symbol[0]}
                </Avatar>
              </AvatarGroup>
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
