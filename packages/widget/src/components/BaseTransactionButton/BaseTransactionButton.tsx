import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import { navigationRoutes } from '../../utils';
import type { BaseTransactionButtonProps } from './types';

export const BaseTransactionButton: React.FC<BaseTransactionButtonProps> = ({
  onClick,
  text,
  disabled,
  loading,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { walletConfig } = useWidgetConfig();
  const { isConnected } = useAccount();

  const handleClick = async () => {
    if (isConnected) {
      onClick?.();
    } else if (walletConfig?.onConnect) {
      walletConfig.onConnect();
    } else {
      navigate(navigationRoutes.selectWallet);
    }
  };

  const getButtonText = () => {
    if (isConnected) {
      if (text) {
        return text;
      }
    }
    return t(`button.connectWallet`);
  };

  return (
    <LoadingButton
      variant="contained"
      color="primary"
      onClick={handleClick}
      disabled={disabled}
      loading={loading}
      loadingPosition="center"
      fullWidth
    >
      {getButtonText()}
    </LoadingButton>
  );
};
