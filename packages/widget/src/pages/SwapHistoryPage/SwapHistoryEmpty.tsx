import { ReceiptLongRounded as HistoryIcon } from '@mui/icons-material';
import { Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const SwapHistoryEmpty: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Container
      sx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingY: 12,
      }}
    >
      <Typography fontSize={48}>
        <HistoryIcon fontSize="inherit" />
      </Typography>
      <Typography fontSize={18} fontWeight={700}>
        {t('swap.info.title.emptySwapHistory')}
      </Typography>
      <Typography
        fontSize={14}
        color="text.secondary"
        textAlign="center"
        mt={2}
      >
        {t('swap.info.message.emptySwapHistory')}
      </Typography>
    </Container>
  );
};
