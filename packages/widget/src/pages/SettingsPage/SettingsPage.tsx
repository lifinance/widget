import { Container } from '@mui/material';
import { BridgeAndExchangeSettings } from './BridgeAndExchangeSettings';
import { LanguageSetting } from './LanguageSetting';
import { ResetSettingsButton } from './ResetSettingsButton';
import { SendToWalletOptionSetting } from './SendToWalletOptionSetting';
import { GasPriceSettings } from './GasPriceSettings';
import { RoutePrioritySettings } from './RoutePrioritySettings';
import { ThemeSettings } from './ThemeSettings';
import { SlippageSettings } from './SlippageSettings';
import { SettingsList, SettingsAccordian } from './SettingsCard';

export const SettingsPage = () => {
  return (
    <Container disableGutters>
      <SettingsAccordian>
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
      </SettingsAccordian>
      <ResetSettingsButton />
    </Container>
  );
};
