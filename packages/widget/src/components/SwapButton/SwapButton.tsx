import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useWallet, useWidgetConfig } from '../../providers';
import { useSplitSubvariantStore } from '../../stores';
import { navigationRoutes } from '../../utils';
import type { SwapButtonProps } from './types';

export const SwapButton: React.FC<SwapButtonProps> = ({
  onClick,
  route,
  text,
  disabled,
  loading,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { variant, subvariant, walletManagement } = useWidgetConfig();
  const { account, connect } = useWallet();
  const splitState = useSplitSubvariantStore((state) => state.state);

  const handleSwapButtonClick = async () => {
    if (!account.isActive) {
      if (walletManagement) {
        await connect();
      } else {
        navigate(navigationRoutes.selectWallet);
      }
    } else {
      onClick?.();
    }
  };

  const getButtonText = () => {
    if (account.isActive) {
      if (!route) {
        switch (variant) {
          case 'nft':
            return t(`button.buy`);
          case 'refuel':
            return t(`button.getGas`);
          default:
            if (subvariant === 'split' && splitState) {
              return t(`button.${splitState}`);
            }
            return t(`button.exchange`);
        }
      }
      if (text) {
        return text;
      }
      switch (variant) {
        case 'nft':
          return t(`button.reviewPurchase`);
        case 'refuel':
          return t(`button.reviewBridge`);
        default:
          const transactionType =
            route.fromChainId === route.toChainId ? 'Swap' : 'Bridge';
          return t(`button.review${transactionType}`);
      }
    }
    return t(`button.connectWallet`);
  };

  return (
    <LoadingButton
      variant="contained"
      color="primary"
      onClick={handleSwapButtonClick}
      disabled={disabled}
      loading={loading}
      loadingPosition="center"
      fullWidth
    >
      {getButtonText()}
    </LoadingButton>
  );
};
