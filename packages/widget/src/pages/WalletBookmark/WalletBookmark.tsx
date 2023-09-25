import { Container } from '@mui/material';
import Alert from '@mui/material/Alert';
import { useTranslation } from 'react-i18next';

export const WalletBookmark = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <Alert severity="info">{t('info.message.fundsToExchange')}</Alert>
    </Container>
  );
};
