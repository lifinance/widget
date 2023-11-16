import { Container } from '@mui/material';
import { BridgeAndExchangeSettings } from './BridgeAndExchangeSettings';
import { LanguageSelect } from './LanguageSelect';
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
        <LanguageSelect />
        <SlippageInput />
      </SettingsList>
      <ResetSettingsButton />
    </Container>
  );
};
