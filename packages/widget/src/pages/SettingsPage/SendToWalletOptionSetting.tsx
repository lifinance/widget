import { Wallet } from '@mui/icons-material';
import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardRowContainer,
  CardTitleContainer,
  CardValue,
} from '../../components/Card';
import { Switch } from '../../components/Switch';
import { useWidgetConfig } from '../../providers';
import {
  useSendToWalletStore,
  useSettings,
  useSettingsStore,
} from '../../stores';
import { HiddenUI } from '../../types';

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
