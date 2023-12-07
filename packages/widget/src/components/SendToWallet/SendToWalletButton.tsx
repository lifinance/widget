import WalletIcon from '@mui/icons-material/Wallet';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useRequiredToAddress, useWidgetEvents } from '../../hooks';
import { FormKey, useWidgetConfig } from '../../providers';
import { useSendToWalletStore, useSettings } from '../../stores';
import { DisabledUI, HiddenUI, WidgetEvent } from '../../types';

export const SendToWalletButton: React.FC = () => {
  const { t } = useTranslation();
  const { setValue } = useFormContext();
  const emitter = useWidgetEvents();
  const { disabledUI, hiddenUI } = useWidgetConfig();
  const { showSendToWallet, toggleSendToWallet } = useSendToWalletStore();
  const { showDestinationWallet } = useSettings(['showDestinationWallet']);

  const requiredToAddress = useRequiredToAddress();

  if (
    !showDestinationWallet ||
    hiddenUI?.includes(HiddenUI.ToAddress) ||
    requiredToAddress
  ) {
    return null;
  }

  const handleClick = () => {
    if (showSendToWallet && !disabledUI?.includes(DisabledUI.ToAddress)) {
      setValue(FormKey.ToAddress, '', { shouldTouch: true });
    }
    toggleSendToWallet();
    emitter.emit(
      WidgetEvent.SendToWalletToggled,
      useSendToWalletStore.getState().showSendToWallet,
    );
  };

  return (
    <Tooltip
      title={t('main.sendToWallet')}
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
        <WalletIcon />
      </Button>
    </Tooltip>
  );
};
