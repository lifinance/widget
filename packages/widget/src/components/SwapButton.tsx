import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SupportedWalletProviders } from '../services/LiFiWalletManagement/LiFiWalletManagement';
import { useWalletInterface } from '../services/walletInterface';
import { SelectWalletDrawer } from './SelectWalletDrawer/SelectWalletDrawer';
import { SelectWalletDrawerBase } from './SelectWalletDrawer/types';

export const Button = styled(LoadingButton)({
  textTransform: 'none',
  borderRadius: 0,
  padding: '12px 16px',
});

export const SwapButton = () => {
  const { t } = useTranslation();
  const { accountInformation } = useWalletInterface();

  const drawerRef = useRef<SelectWalletDrawerBase>(null);

  const openWalletDrawer = () => drawerRef.current?.openDrawer();

  return (
    <>
      <Button
        variant="contained"
        disableElevation
        fullWidth
        color={accountInformation.isActive ? 'primary' : 'success'}
        // onClick={accountInformation.isActive ? undefined : async () => connect()}
        onClick={
          accountInformation.isActive
            ? undefined
            : async () => openWalletDrawer()
        }
        // loading={isActivating}
      >
        {accountInformation.isActive
          ? t(`swap.submit`)
          : t(`swap.connectWallet`)}
      </Button>
      <SelectWalletDrawer ref={drawerRef} />
    </>
  );
};
