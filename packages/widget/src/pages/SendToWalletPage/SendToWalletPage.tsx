import InfoIcon from '@mui/icons-material/Info';
import { FormHelperText } from '@mui/material';
import { useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SendToWallet } from '../../components/SendToWallet';
import { SendToWalletConfirmButton } from '../../components/SendToWalletConfirmButton';
import { AlertSection, PageContainer } from './SendToWalletPage.styled';

export const SendToWalletPage = () => {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <SendToWallet />
      <SendToWalletFormHelperText />
      <AlertSection severity="info" icon={<InfoIcon />}>
        {t('info.message.fundsToExchange')}
      </AlertSection>
      <SendToWalletConfirmButton />
    </PageContainer>
  );
};

export const SendToWalletFormHelperText: React.FC = () => {
  const { errors } = useFormState();

  return (
    <FormHelperText error={!!errors.toAddress}>
      {errors.toAddress?.message as string}
    </FormHelperText>
  );
};
