import { ChainId } from '@lifinance/sdk';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useChains, useHasSufficientBalance, useSwapRoutes } from '../../hooks';
import { useSwapExecutionContext } from '../../providers/SwapExecutionProvider';
import { SwapFormKeyHelper } from '../../providers/SwapFormProvider';
import { useWallet } from '../../providers/WalletProvider';
import { routes } from '../../utils/routes';
import { ButtonTooltip } from './ButtonTooltip';
import { Button } from './SwapButton.style';

export const SwapButton: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getChainById } = useChains();
  const { account, switchChain } = useWallet();
  const { executeRoute } = useSwapExecutionContext();

  const { routes: swapRoutes, isLoading } = useSwapRoutes();

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
      navigate(routes.swapping);
    }
  };

  const getButtonText = () => {
    if (account.isActive) {
      if (getChainById(chainId || ChainId.ETH)?.id !== account.chainId) {
        return t(`swap.switchChain`);
      }
      if (!hasSufficientBalance) {
        return t(`swap.insufficientFunds`);
      }
      if (!hasGasBalanceOnStartChain) {
        return t(`swap.insufficientGasOnStartChain`);
      }
      if (!hasGasOnCrossChain) {
        return t(`swap.insufficientGasOnDestinationChain`);
      }
      return t(`swap.submit`);
    }
    return t(`swap.connectWallet`);
  };

  return (
    <ButtonTooltip
      title={
        !hasGasOnCrossChain
          ? t(`swap.insufficientGasOnDestinationChainTooltip`)
          : undefined
      }
    >
      <Button
        variant="contained"
        disableElevation
        fullWidth
        color={account.isActive ? 'primary' : 'success'}
        onClick={handleSwapButtonClick}
        loading={isLoading}
        disabled={
          !hasSufficientBalance ||
          !hasGasBalanceOnStartChain ||
          !hasGasOnCrossChain
        }
      >
        {getButtonText()}
      </Button>
    </ButtonTooltip>
  );
};
