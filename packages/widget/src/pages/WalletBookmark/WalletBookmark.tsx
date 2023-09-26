import { Container } from '@mui/material';
import Alert from '@mui/material/Alert';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/Card';
import { FormControl, Input } from './WalletBookmark.styled';

export const WalletBookmark = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <Alert severity="info">{t('info.message.fundsToExchange')}</Alert>
      <Card sx={{ marginTop: '16px' }}>
        <FormControl
          fullWidth
          sx={{
            paddingTop: '6px',
            paddingBottom: '5px',
          }}
        >
          <Input
            sx={{ height: '96px', alignItems: 'flex-start' }}
            size="small"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            placeholder={t('bookmark.enterAddressOrEns') as string}
          />
        </FormControl>
      </Card>
    </Container>
  );
};
