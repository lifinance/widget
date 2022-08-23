import {
  ArrowForward as ArrowForwardIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
} from '@mui/icons-material';
import type { BoxProps } from '@mui/material';
import { Box, Stack } from '@mui/material';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../providers';
import { useExecutingRoutes } from '../../stores';
import { navigationRoutes } from '../../utils';
import { CardTitle } from '../Card';
import { TokenAvatar, TokenAvatarGroup } from '../TokenAvatar';
import { ProgressCard, RouteCard } from './SwapsInProgress.style';

export const SwapsInProgress: React.FC<BoxProps> = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { account } = useWallet();
  const executingRoutes = useExecutingRoutes(account.address);

  const handleCardClick = useCallback(
    (routeId: string) => {
      navigate(navigationRoutes.swapExecution, { state: { routeId } });
    },
    [navigate],
  );

  if (!executingRoutes?.length) {
    return null;
  }

  return (
    <ProgressCard {...props}>
      <CardTitle>{t('swap.activeTransfers')}</CardTitle>
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
    </ProgressCard>
  );
};
