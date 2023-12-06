import RouteIcon from '@mui/icons-material/Route';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const RouteNotFoundCard: React.FC = () => {
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
        {t('info.title.routeNotFound')}
      </Typography>
      <Typography
        fontSize={14}
        color="text.secondary"
        textAlign="center"
        mt={2}
      >
        {t('info.message.routeNotFound')}
      </Typography>
    </Box>
  );
};
