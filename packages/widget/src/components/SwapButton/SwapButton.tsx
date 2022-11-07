import { LoadingButton } from '@mui/lab';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useGasSufficiency } from '../../hooks';
import { useWallet, useWidgetConfig } from '../../providers';
import { navigationRoutes } from '../../utils';
import type { SwapButtonProps } from './types';

export const SwapButton = forwardRef<HTMLButtonElement, SwapButtonProps>(
  ({ onClick, currentRoute, text, disable, enableLoading, loading }, ref) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { variant, walletManagement } = useWidgetConfig();
    const { account, connect } = useWallet();

    const {
      insufficientFunds,
      insufficientGas,
      isLoading: isGasSufficiencyLoading,
    } = useGasSufficiency(currentRoute);

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
          : t(`button.startSwap`);
      }
      return t(`button.connectWallet`);
    };

    return (
      <LoadingButton
        variant="contained"
        color={account.isActive ? 'primary' : 'success'}
        onClick={handleSwapButtonClick}
        disabled={insufficientFunds || !!insufficientGas?.length || disable}
        loading={enableLoading && (loading || isGasSufficiencyLoading)}
        loadingPosition="center"
        fullWidth
        ref={ref}
      >
        {getButtonText()}
      </LoadingButton>
    );
  },
);
