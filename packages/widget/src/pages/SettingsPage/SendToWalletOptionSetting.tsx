import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import WalletIcon from '@mui/icons-material/Wallet';
import { Switch } from '../../components/Switch';
import { useWidgetConfig } from '../../providers';
import {
  useSendToWalletStore,
  useSettings,
  useSettingsStore,
} from '../../stores';
import { HiddenUI } from '../../types';
import {
  SettingCard,
  SummaryRowContainer,
  SummaryTitleContainer,
  SummaryValue,
} from './SettingsCard';

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
    <SettingCard>
      <SummaryRowContainer>
        <SummaryTitleContainer>
          <WalletIcon />
          <SummaryValue>{t(`settings.sendToWalletOption`)}</SummaryValue>
        </SummaryTitleContainer>
        <Switch checked={showDestinationWallet} onChange={onChange} />
      </SummaryRowContainer>
    </SettingCard>
  );
};
