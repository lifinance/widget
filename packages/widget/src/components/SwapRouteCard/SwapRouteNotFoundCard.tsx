import { Route as RouteIcon } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const SwapRouteNotFoundCard: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        flex: 1,
      }}
      py={1.625}
    >
      <Typography fontSize={48}>
        <RouteIcon fontSize="inherit" />
      </Typography>
      <Typography fontSize={18} fontWeight={700}>
        {t('swap.info.title.routeNotFound')}
      </Typography>
      <Typography
        fontSize={14}
        color="text.secondary"
        textAlign="center"
        mt={2}
      >
        {t('swap.info.message.routeNotFound')}
      </Typography>
    </Box>
  );
};
