import { WalletOutlined as WalletOutlinedIcon } from '@mui/icons-material';
import { Button, Tooltip } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SwapFormKey, useWallet, useWidgetConfig } from '../../providers';
import { useSendToWalletStore, useSettings } from '../../stores';
import { DisabledUI, HiddenUI } from '../../types';

export const SendToWalletButton: React.FC = () => {
  const { t } = useTranslation();
  const { setValue } = useFormContext();
  const { account } = useWallet();
  const { disabledUI, hiddenUI, requiredUI } = useWidgetConfig();
  const { showSendToWallet, toggleSendToWallet } = useSendToWalletStore();
  const { showDestinationWallet } = useSettings(['showDestinationWallet']);

  if (
    !showDestinationWallet ||
    !account.isActive ||
    hiddenUI?.includes(HiddenUI.ToAddress) ||
    requiredUI?.includes(HiddenUI.ToAddress)
  ) {
    return null;
  }

  const handleClick = () => {
    if (showSendToWallet && !disabledUI?.includes(DisabledUI.ToAddress)) {
      setValue(SwapFormKey.ToAddress, '', { shouldTouch: true });
    }
    toggleSendToWallet();
  };

  return (
    <Tooltip
      title={t('swap.sendToWallet')}
      placement="bottom-end"
      enterDelay={400}
      arrow
    >
      <Button
        variant={showSendToWallet ? 'contained' : 'text'}
        onClick={handleClick}
        sx={{
          minWidth: 48,
          marginLeft: 1,
        }}
      >
        <WalletOutlinedIcon />
      </Button>
    </Tooltip>
  );
};
