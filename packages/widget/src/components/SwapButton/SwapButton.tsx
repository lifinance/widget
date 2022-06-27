import { ChainId } from '@lifinance/sdk';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useChains, useHasSufficientBalance, useSwapRoutes } from '../../hooks';
import { SwapFormKeyHelper } from '../../providers/SwapFormProvider';
import { useWallet } from '../../providers/WalletProvider';
import { useWidgetConfig } from '../../providers/WidgetProvider';
import { useCurrentRoute, useSetExecutableRoute } from '../../stores';
import { routes } from '../../utils/routes';
import { ButtonTooltip } from './ButtonTooltip';
import { Button } from './SwapButton.style';

export const SwapButton: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getChainById } = useChains();
  const config = useWidgetConfig();
  const { account, switchChain, connect: walletConnect } = useWallet();
  const [currentRoute] = useCurrentRoute();
  const setExecutableRoute = useSetExecutableRoute();

  const { routes: swapRoutes, isLoading, isFetching } = useSwapRoutes();

  const {
    hasGasBalanceOnStartChain,
    hasGasOnCrossChain,
    hasSufficientBalance,
  } = useHasSufficientBalance();

  const [chainId] = useWatch({
    name: [SwapFormKeyHelper.getChainKey('from')],
  });
  const isCurrentChainMatch =
    getChainById(chainId || ChainId.ETH)?.id === account.chainId;

  const handleSwapButtonClick = async () => {
    if (!account.isActive) {
      if (config.walletManagement) {
        await walletConnect();
      } else {
        navigate(routes.selectWallet);
      }
    } else if (!isCurrentChainMatch) {
      await switchChain(chainId!);
      // check that the current route exists in the up to date route list
    } else if (
      currentRoute &&
      swapRoutes?.some((route) => route.id === currentRoute.id)
    ) {
      setExecutableRoute(currentRoute);
      navigate(routes.swap, {
        state: { routeId: currentRoute.id },
      });
    }
  };

  const getButtonText = () => {
    if (account.isActive) {
      if (!isCurrentChainMatch) {
        return t(`button.switchChain`);
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
      return t(`button.swap`);
    }
    return t(`button.connectWallet`);
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
        // loading={isLoading || isFetching}
        disabled={
          (!hasSufficientBalance ||
            !hasGasBalanceOnStartChain ||
            !hasGasOnCrossChain ||
            isLoading ||
            isFetching) &&
          isCurrentChainMatch
        }
      >
        {getButtonText()}
      </Button>
    </ButtonTooltip>
  );
};
