import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { SupportedWalletProviders } from '../services/LiFiWalletManagement/LiFiWalletManagement';
import { useWalletInterface } from '../services/walletInterface';

export const Button = styled(LoadingButton)({
  textTransform: 'none',
  borderRadius: 0,
  padding: '12px 16px',
});

export const SwapButton = () => {
  const { t } = useTranslation();
  const { connect, accountInformation } = useWalletInterface();

  return (
    <Button
      variant="contained"
      disableElevation
      fullWidth
      color={accountInformation.isActive ? 'primary' : 'success'}
      onClick={accountInformation.isActive ? undefined : async () => connect()}
      // loading={isActivating}
    >
      {accountInformation.isActive ? t(`swap.submit`) : t(`swap.connectWallet`)}
    </Button>
  );
};
