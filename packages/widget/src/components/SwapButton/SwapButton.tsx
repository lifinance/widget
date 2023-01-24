import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useWallet, useWidgetConfig } from '../../providers';
import { navigationRoutes } from '../../utils';
import type { SwapButtonProps } from './types';

export const SwapButton: React.FC<SwapButtonProps> = ({
  onClick,
  currentRoute,
  text,
  disabled,
  loading,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { variant, walletManagement } = useWidgetConfig();
  const { account, connect } = useWallet();

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
      if (!currentRoute) {
        return variant !== 'refuel' ? t(`button.swap`) : t(`button.getGas`);
      }
      if (text) {
        return text;
      }
      return variant !== 'refuel'
        ? t(`button.reviewSwap`)
        : t(`button.reviewGasSwap`);
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
