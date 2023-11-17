import { Container } from '@mui/material';
import { BridgeAndExchangeSettings } from './BridgeAndExchangeSettings';
import { LanguageSetting } from './LanguageSetting';
import { ResetSettingsButton } from './ResetSettingsButton';
import { SendToWalletOptionSetting } from './SendToWalletOptionSetting';
import { SlippageInput } from './SlippageInput';

import { GasPriceSettings } from './GasPriceSettings';
import { RoutePrioritySettings } from './RoutePrioritySettings';
import { ThemeSettings } from './ThemeSettings';
import { SettingsList } from './SettingsPage.style';

export const SettingsPage = () => {
  return (
    <Container disableGutters>
      <SettingsList>
        <ThemeSettings />
        <RoutePrioritySettings />
        <GasPriceSettings />
        <BridgeAndExchangeSettings type="Bridges" />
        <BridgeAndExchangeSettings type="Exchanges" />
        <SendToWalletOptionSetting />
        <LanguageSetting />
        <SlippageInput />
      </SettingsList>
      <ResetSettingsButton />
    </Container>
  );
};
