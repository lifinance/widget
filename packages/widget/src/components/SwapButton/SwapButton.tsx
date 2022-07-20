import { ChainId } from '@lifi/sdk';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useChains, useHasSufficientBalance } from '../../hooks';
import { SwapFormKeyHelper } from '../../providers/SwapFormProvider';
import { useWallet } from '../../providers/WalletProvider';
import { useWidgetConfig } from '../../providers/WidgetProvider';
import { navigationRoutes } from '../../utils';
import { Button } from './SwapButton.style';
import { SwapButtonProps } from './types';

export const SwapButton: React.FC<SwapButtonProps> = ({
  onClick,
  text,
  loading,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getChainById } = useChains();
  const config = useWidgetConfig();
  const { account, switchChain, connect: walletConnect } = useWallet();

  const { hasGasOnStartChain, hasGasOnCrossChain, hasSufficientBalance } =
    useHasSufficientBalance();

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
        navigate(navigationRoutes.selectWallet);
      }
    } else if (!isCurrentChainMatch) {
      await switchChain(chainId!);
      // check that the current route exists in the up to date route list
    } else {
      onClick?.();
    }
  };

  const getButtonText = () => {
    if (account.isActive) {
      if (!isCurrentChainMatch) {
        return t(`button.switchChain`);
      }
      return text || t(`button.reviewSwap`);
    }
    return t(`button.connectWallet`);
  };

  return (
    <Button
      variant="contained"
      disableElevation
      fullWidth
      color={account.isActive ? 'primary' : 'success'}
      onClick={handleSwapButtonClick}
      // loading={isLoading || isFetching}
      disabled={
        (!hasSufficientBalance ||
          !hasGasOnStartChain ||
          !hasGasOnCrossChain ||
          loading) &&
        isCurrentChainMatch
      }
    >
      {getButtonText()}
    </Button>
  );
};
