import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { useRef } from 'react';
import { useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChainId, getChainById } from '..';
import { SwapFormKeyHelper } from '../providers/SwapFormProvider';
import { useWalletInterface } from '../services/walletInterface';
import { SelectWalletDrawer } from './SelectWalletDrawer/SelectWalletDrawer';
import { SelectWalletDrawerBase } from './SelectWalletDrawer/types';
import { routes } from '../utils/routes';

export const Button = styled(LoadingButton)({
  textTransform: 'none',
  borderRadius: 0,
  padding: '12px 16px',
});

export const SwapButton = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { accountInformation, switchChain } = useWalletInterface();
  const [chainId] = useWatch({
    name: [
      SwapFormKeyHelper.getChainKey('from'),
      SwapFormKeyHelper.getTokenKey('from'),
    ],
  });

  const drawerRef = useRef<SelectWalletDrawerBase>(null);

  const openWalletDrawer = () => drawerRef.current?.openDrawer();

  const handleSwapButtonClick = async () => {
    if (!accountInformation.isActive) {
      openWalletDrawer();
    } else if (
      getChainById(chainId || ChainId.ETH).id !== accountInformation.chainId
    ) {
      await switchChain(chainId!);
    } else {
      navigate(routes.transaction, { replace: true });
    }
  };

  return (
    <>
      <Button
        variant="contained"
        disableElevation
        fullWidth
        color={accountInformation.isActive ? 'primary' : 'error'}
        onClick={handleSwapButtonClick}
        // loading={isActivating}
      >
        {accountInformation.isActive
          ? getChainById(chainId || ChainId.ETH).id ===
            accountInformation.chainId
            ? t(`swap.submit`)
            : t(`swap.switchChain`)
          : t(`swap.connectWallet`)}
      </Button>
      <SelectWalletDrawer ref={drawerRef} />
    </>
  );
};
