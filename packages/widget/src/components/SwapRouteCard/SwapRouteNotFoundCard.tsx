import { Route as RouteIcon } from '@mui/icons-material';
import { Box, BoxProps, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Card } from '../Card';
import { SwapRouteCardSkeletonProps } from './types';

export const SwapRouteNotFoundCard: React.FC<
  SwapRouteCardSkeletonProps & BoxProps
> = ({ dense, ...other }) => {
  const { t } = useTranslation();
  return (
    <Card dense={dense} indented {...other}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          flex: 1,
        }}
        py={1.375}
      >
        <RouteIcon fontSize="large" />
        <Typography fontSize={16} fontWeight="500" mt={2}>
          {t('swap.info.title.routeNotFound')}
        </Typography>
        <Typography
          fontSize={14}
          color="text.secondary"
          textAlign="center"
          mt={1}
        >
          {t('swap.info.message.routeNotFound')}
        </Typography>
      </Box>
    </Card>
  );
};
