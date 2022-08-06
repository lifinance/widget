import { ChainId } from '@lifi/sdk';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useChains, useGasSufficiency } from '../../hooks';
import { SwapFormKeyHelper } from '../../providers/SwapFormProvider';
import { useWallet } from '../../providers/WalletProvider';
import { useWidgetConfig } from '../../providers/WidgetProvider';
import { navigationRoutes } from '../../utils';
import { Button } from './SwapButton.style';
import { SwapButtonProps } from './types';

export const SwapButton: React.FC<SwapButtonProps> = ({
  onClick,
  currentRoute,
  text,
  loading,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getChainById } = useChains();
  const config = useWidgetConfig();
  const { account, switchChain, connect: walletConnect } = useWallet();

  const { insufficientFunds, insufficientGas } =
    useGasSufficiency(currentRoute);

  const [chainId] = useWatch({
    name: [SwapFormKeyHelper.getChainKey('from')],
  });

  // Allow switching chain only if execution is not started
  const switchChainAllowed =
    getChainById(chainId || ChainId.ETH)?.id !== account.chainId &&
    currentRoute &&
    !currentRoute.steps.some((step) => step.execution);

  const handleSwapButtonClick = async () => {
    if (!account.isActive) {
      if (config.walletManagement) {
        await walletConnect();
      } else {
        navigate(navigationRoutes.selectWallet);
      }
    } else if (switchChainAllowed) {
      await switchChain(chainId!);
      // check that the current route exists in the up to date route list
    } else {
      onClick?.();
    }
  };

  const getButtonText = () => {
    if (account.isActive) {
      if (switchChainAllowed) {
        return t(`button.switchChain`);
      }
      if (!currentRoute) {
        return t(`button.swap`);
      }
      return text || t(`button.reviewSwap`);
    }
    return t(`button.connectWallet`);
  };

  return (
    <Button
      variant="contained"
      color={account.isActive ? 'primary' : 'success'}
      onClick={handleSwapButtonClick}
      // loading={isLoading || isFetching}
      disabled={
        (insufficientFunds || !!insufficientGas.length || loading) &&
        currentRoute &&
        !switchChainAllowed
      }
      fullWidth
    >
      {getButtonText()}
    </Button>
  );
};
