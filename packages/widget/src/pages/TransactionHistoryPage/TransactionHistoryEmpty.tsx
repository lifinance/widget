import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import { Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const TransactionHistoryEmpty: React.FC = () => {
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
        <ReceiptLongRoundedIcon fontSize="inherit" />
      </Typography>
      <Typography fontSize={18} fontWeight={700}>
        {t('info.title.emptyTransactionHistory')}
      </Typography>
      <Typography
        fontSize={14}
        color="text.secondary"
        textAlign="center"
        mt={2}
      >
        {t('info.message.emptyTransactionHistory')}
      </Typography>
    </Container>
  );
};
