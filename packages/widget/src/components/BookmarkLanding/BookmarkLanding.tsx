import { useTranslation } from 'react-i18next';
import { Card } from '../../components/Card';
import InfoIcon from '@mui/icons-material/Info';
import { AlertSection, FormControl, Input, PageContainer } from './BookmarkLanding.styled';

export const BookmarkLanding = () => {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <AlertSection severity="info" icon={<InfoIcon />}>{t('info.message.fundsToExchange')}</AlertSection>
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
    </PageContainer>
  );
};
