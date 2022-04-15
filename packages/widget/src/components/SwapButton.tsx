import { ChainId } from '@lifinance/sdk';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useChains, useHasSufficientBalance, useSwapRoutes } from '../hooks';
import { useSwapExecutionContext } from '../providers/SwapExecutionProvider';
import { SwapFormKeyHelper } from '../providers/SwapFormProvider';
import { useWallet } from '../providers/WalletProvider';
import { routes } from '../utils/routes';

export const Button = styled(LoadingButton)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.25, 2),
  fontSize: '1rem',
}));

export const SwapButton: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getChainById } = useChains();
  const { account, switchChain } = useWallet();
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

  const handleSwapButtonClick = async () => {
    if (!account.isActive) {
      navigate(routes.selectWallet);
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
