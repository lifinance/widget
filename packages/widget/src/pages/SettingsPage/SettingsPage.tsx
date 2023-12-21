import { PageContainer } from '../../components/PageContainer';
import { BridgeAndExchangeSettings } from './BridgeAndExchangeSettings';
import { GasPriceSettings } from './GasPriceSettings';
import { LanguageSetting } from './LanguageSetting';
import { ResetSettingsButton } from './ResetSettingsButton';
import { RoutePrioritySettings } from './RoutePrioritySettings';
import { SendToWalletOptionSetting } from './SendToWalletOptionSetting';
import { SettingsCardAccordion, SettingsList } from './SettingsCard';
import { SlippageSettings } from './SlippageSettings';
import { ThemeSettings } from './ThemeSettings';

export const SettingsPage = () => {
  return (
    <PageContainer>
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
    </PageContainer>
  );
};
