import { Outlet, useLocation } from '@tanstack/react-router'
import { PageContainer } from '../../components/PageContainer.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { BridgeAndExchangeSettings } from './BridgeAndExchangeSettings.js'
import { GasPriceSettings } from './GasPriceSettings.js'
import { LanguageSetting } from './LanguageSetting.js'
import { ResetSettingsButton } from './ResetSettingsButton.js'
import { RoutePrioritySettings } from './RoutePrioritySettings.js'
import { SettingsList } from './SettingsCard/SettingCard.style.js'
import { SettingsCardAccordion } from './SettingsCard/SettingsAccordian.js'
import { SlippageSettings } from './SlippageSettings/SlippageSettings.js'
import { ThemeSettings } from './ThemeSettings.js'

export const SettingsPage = () => {
  const { pathname } = useLocation()

  if (pathname === navigationRoutes.settings) {
    return (
      <PageContainer bottomGutters>
        <SettingsList>
          <SettingsCardAccordion>
            <ThemeSettings />
            <LanguageSetting />
            <RoutePrioritySettings />
            <GasPriceSettings />
            <SlippageSettings />
            <BridgeAndExchangeSettings type="Bridges" />
            <BridgeAndExchangeSettings type="Exchanges" />
          </SettingsCardAccordion>
        </SettingsList>
        <ResetSettingsButton />
      </PageContainer>
    )
  }

  return <Outlet />
}
