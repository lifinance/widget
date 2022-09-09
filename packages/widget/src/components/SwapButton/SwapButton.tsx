import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useGasSufficiency } from '../../hooks';
import { useWallet, useWidgetConfig } from '../../providers';
import { navigationRoutes } from '../../utils';
import type { SwapButtonProps } from './types';

export const SwapButton: React.FC<SwapButtonProps> = ({
  onClick,
  currentRoute,
  text,
  disable,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const config = useWidgetConfig();
  const { account, connect } = useWallet();

  const { insufficientFunds, insufficientGas } =
    useGasSufficiency(currentRoute);

  const handleSwapButtonClick = async () => {
    if (!account.isActive) {
      if (config.walletManagement) {
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
      disabled={insufficientFunds || !!insufficientGas?.length || disable}
      fullWidth
    >
      {getButtonText()}
    </Button>
  );
};
