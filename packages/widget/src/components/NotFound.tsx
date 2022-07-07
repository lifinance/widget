import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const NotFound: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        flex: 1,
        padding: 3,
      }}
    >
      <Typography variant="h6">{t('tooltip.notFound.title')}</Typography>
      <Typography>{t('tooltip.notFound.text')}</Typography>
    </Box>
  );
};
