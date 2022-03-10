import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChainId, getChainById } from '..';
import { useWidgetConfig } from '../providers/WidgetProvider';
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
  const config = useWidgetConfig();

  const drawerRef = useRef<SelectWalletDrawerBase>(null);

  const openWalletDrawer = () => drawerRef.current?.openDrawer();

  return (
    <>
      <Button
        variant="contained"
        disableElevation
        fullWidth
        color={accountInformation.isActive ? 'primary' : 'error'}
        // onClick={accountInformation.isActive ? undefined : async () => connect()}
        onClick={
          accountInformation.isActive
            ? undefined
            : async () => openWalletDrawer()
        }
        // loading={isActivating}
      >
        {accountInformation.isActive
          ? getChainById(config.fromChain || ChainId.ETH).id ===
            accountInformation.chainId
            ? t(`swap.submit`)
            : t(`swap.switchChain`)
          : t(`swap.connectWallet`)}
      </Button>
      <SelectWalletDrawer ref={drawerRef} />
    </>
  );
};
