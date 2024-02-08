import { Wallet } from '@mui/icons-material';
import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/Card/Card.js';
import {
  CardRowContainer,
  CardTitleContainer,
  CardValue,
} from '../../components/Card/CardButton.style.js';
import { Switch } from '../../components/Switch.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { useSendToWalletStore } from '../../stores/settings/useSendToWalletStore.js';
import { useSettings } from '../../stores/settings/useSettings.js';
import { useSettingsStore } from '../../stores/settings/useSettingsStore.js';
import { HiddenUI } from '../../types/widget.js';

export const SendToWalletOptionSetting = () => {
  const { t } = useTranslation();
  const { hiddenUI } = useWidgetConfig();
  const setSendToWallet = useSendToWalletStore(
    (state) => state.setSendToWallet,
  );
  const setValue = useSettingsStore((state) => state.setValue);
  const { showDestinationWallet } = useSettings(['showDestinationWallet']);

  if (hiddenUI?.includes(HiddenUI.ToAddress)) {
    return null;
  }

  const onChange = (_: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setValue('showDestinationWallet', checked);
    setSendToWallet(false);
  };

  return (
    <Card>
      <CardRowContainer>
        <CardTitleContainer>
          <Wallet />
          <CardValue>{t(`settings.sendToWalletOption`)}</CardValue>
        </CardTitleContainer>
        <Switch checked={showDestinationWallet} onChange={onChange} />
      </CardRowContainer>
    </Card>
  );
};
