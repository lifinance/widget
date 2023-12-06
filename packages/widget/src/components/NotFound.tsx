import BlockIcon from '@mui/icons-material/Block';
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
      <Typography fontSize={48}>
        <BlockIcon fontSize="inherit" />
      </Typography>
      <Typography fontSize={18} fontWeight={700}>
        {t('tooltip.notFound.title')}
      </Typography>
      <Typography
        fontSize={14}
        color="text.secondary"
        textAlign="center"
        mt={2}
      >
        {t('tooltip.notFound.text')}
      </Typography>
    </Box>
  );
};
