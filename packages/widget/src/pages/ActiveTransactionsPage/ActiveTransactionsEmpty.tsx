import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const ActiveTransactionsEmpty: React.FC = () => {
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
        <SwapHorizIcon fontSize="inherit" />
      </Typography>
      <Typography fontSize={18} fontWeight={700}>
        {t('info.title.emptyActiveTransactions')}
      </Typography>
      <Typography
        fontSize={14}
        color="text.secondary"
        textAlign="center"
        mt={2}
      >
        {t('info.message.emptyActiveTransactions')}
      </Typography>
    </Container>
  );
};
