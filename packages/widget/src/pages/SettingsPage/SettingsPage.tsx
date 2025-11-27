import { useTranslation } from 'react-i18next'
import { PageContainer } from '../../components/PageContainer'
import { useHeader } from '../../hooks/useHeader'
import { BridgeAndExchangeSettings } from './BridgeAndExchangeSettings'
import { GasPriceSettings } from './GasPriceSettings'
import { LanguageSetting } from './LanguageSetting'
import { ResetSettingsButton } from './ResetSettingsButton'
import { RoutePrioritySettings } from './RoutePrioritySettings'
import { SettingsList } from './SettingsCard/SettingCard.style'
import { SettingsCardAccordion } from './SettingsCard/SettingsAccordian'
import { SlippageSettings } from './SlippageSettings/SlippageSettings'
import { ThemeSettings } from './ThemeSettings'

export const SettingsPage = () => {
  const { t } = useTranslation()
  useHeader(t('header.settings'))

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
