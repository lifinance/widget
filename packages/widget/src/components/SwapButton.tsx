import { ChainId } from '@lifinance/sdk';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { RefObject } from 'react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  useChains,
  useHasSufficientBalance,
  useSwapRoutes,
  useWalletInterface
} from '../hooks';
import { useSwapExecutionContext } from '../providers/SwapExecutionProvider';
import { SwapFormKeyHelper } from '../providers/SwapFormProvider';
import { routes } from '../utils/routes';
import { SelectWalletDrawerBase } from './SelectWalletDrawer';

export const Button = styled(LoadingButton)({
  textTransform: 'none',
  borderRadius: 0,
  padding: '12px 16px',
});

export const SwapButton: React.FC<{
  drawerRef: RefObject<SelectWalletDrawerBase>;
}> = ({ drawerRef }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getChainById } = useChains();
  const { account, switchChain } = useWalletInterface();
  const { executeRoute } = useSwapExecutionContext();
  const { routes: swapRoutes } = useSwapRoutes();
  const {
    hasGasBalanceOnStartChain,
    hasGasOnCrossChain,
    hasSufficientBalance,
  } = useHasSufficientBalance(swapRoutes?.[0]);
  const [chainId] = useWatch({
    name: [SwapFormKeyHelper.getChainKey('from')],
  });

  const openWalletDrawer = () => drawerRef.current?.openDrawer();

  const handleSwapButtonClick = async () => {
    if (!account.isActive) {
      openWalletDrawer();
    } else if (getChainById(chainId || ChainId.ETH)?.id !== account.chainId) {
      await switchChain(chainId!);
    } else if (swapRoutes?.length) {
      executeRoute(swapRoutes[0]);
      navigate(routes.transaction, {
        replace: true,
      });
    }
  };

  // useEffect(() => {
  //   console.log('hasSufficientBalance', hasSufficientBalance);
  //   console.log('hasGasBalanceOnStartChain', hasGasBalanceOnStartChain);
  //   console.log('hasGasOnCrossChain', hasGasOnCrossChain);
  // }, [hasGasBalanceOnStartChain, hasGasOnCrossChain, hasSufficientBalance]);

  return (
    <Button
      variant="contained"
      disableElevation
      fullWidth
      color={account.isActive ? 'primary' : 'success'}
      onClick={handleSwapButtonClick}
      // loading={isActivating}
    >
      {account.isActive
        ? getChainById(chainId || ChainId.ETH)?.id === account.chainId
          ? t(`swap.submit`)
          : t(`swap.switchChain`)
        : t(`swap.connectWallet`)}
    </Button>
  );
};
