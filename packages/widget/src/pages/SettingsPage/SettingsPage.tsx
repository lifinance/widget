import { Container } from '@mui/material';
import { BridgeAndExchangeSettings } from './BridgeAndExchangeSettings';
import { LanguageSetting } from './LanguageSetting';
import { ResetSettingsButton } from './ResetSettingsButton';
import { SendToWalletOptionSetting } from './SendToWalletOptionSetting';
import { GasPriceSettings } from './GasPriceSettings';
import { RoutePrioritySettings } from './RoutePrioritySettings';
import { ThemeSettings } from './ThemeSettings';
import { SettingsList } from './SettingsPage.style';
import { SlippageSettings } from './SlippageSettings';

export const SettingsPage = () => {
  return (
    <Container disableGutters>
      <SettingsList>
        <ThemeSettings />
        <LanguageSetting />
        <RoutePrioritySettings />
        <GasPriceSettings />
        <SlippageSettings />
        <BridgeAndExchangeSettings type="Bridges" />
        <BridgeAndExchangeSettings type="Exchanges" />
        <SendToWalletOptionSetting />
      </SettingsList>
      <ResetSettingsButton />
    </Container>
  );
};
