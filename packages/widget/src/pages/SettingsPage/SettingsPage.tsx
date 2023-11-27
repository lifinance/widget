import { Container } from '@mui/material';
import { BridgeAndExchangeSettings } from './BridgeAndExchangeSettings';
import { LanguageSetting } from './LanguageSetting';
import { ResetSettingsButton } from './ResetSettingsButton';
import { SendToWalletOptionSetting } from './SendToWalletOptionSetting';
import { GasPriceSettings } from './GasPriceSettings';
import { RoutePrioritySettings } from './RoutePrioritySettings';
import { ThemeSettings } from './ThemeSettings';
import { SlippageSettings } from './SlippageSettings';
import { SettingsList, SettingsCardAccordion } from './SettingsCard';

export const SettingsPage = () => {
  return (
    <Container disableGutters>
      <SettingsList>
        <SettingsCardAccordion>
          <ThemeSettings />
          <LanguageSetting />
          <RoutePrioritySettings />
          <GasPriceSettings />
          <SlippageSettings />
          <BridgeAndExchangeSettings type="Bridges" />
          <BridgeAndExchangeSettings type="Exchanges" />
          <SendToWalletOptionSetting />
        </SettingsCardAccordion>
      </SettingsList>
      <ResetSettingsButton />
    </Container>
  );
};
