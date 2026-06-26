import type { BoxProps } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useSplitMode } from '../../stores/navigationTabs/useNavigationTabsStore.js'
import { useSettingsStore } from '../../stores/settings/SettingsStore.js'
import { useSettings } from '../../stores/settings/useSettings.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { Card } from '../Card/Card.js'
import {
  SettingsPanelButton,
  SettingsPanelContainer,
  SettingsPanelTitle,
  SettingsPanelValue,
} from './SettingsPanel.style.js'
import {
  bridgeSettingsPanelKeys,
  type SettingsPanelKey,
  swapSettingsPanelKeys,
} from './utils.js'

export const SettingsPanel: React.FC<BoxProps> = (props): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const splitMode = useSplitMode()
  const { slippage, routePriority } = useSettings(['slippage', 'routePriority'])
  const [enabledBridges, totalBridges, enabledExchanges, totalExchanges] =
    useSettingsStore((state) => [
      Object.values(state._enabledBridges).filter(Boolean).length,
      Object.values(state._enabledBridges).length,
      Object.values(state._enabledExchanges).filter(Boolean).length,
      Object.values(state._enabledExchanges).length,
    ])

  const rows =
    splitMode === 'bridge' ? bridgeSettingsPanelKeys : swapSettingsPanelKeys

  const labelByKey: Record<SettingsPanelKey, string> = {
    routePriority: t('settings.routePriority'),
    exchanges: t('settings.enabledExchanges'),
    bridges: t('settings.enabledBridges'),
    slippage: t('settings.slippage'),
  }

  const valueByKey: Record<SettingsPanelKey, string> = {
    routePriority:
      routePriority === 'FASTEST'
        ? t('settings.routePriorityOptions.fastest.title')
        : t('settings.routePriorityOptions.cheapest.title'),
    exchanges: `${enabledExchanges}/${totalExchanges}`,
    bridges: `${enabledBridges}/${totalBridges}`,
    slippage: slippage ? `${slippage}%` : t('button.auto'),
  }

  const handleClick = (key: SettingsPanelKey) => {
    navigate({
      to: `/${navigationRoutes.settings}/${navigationRoutes[key]}`,
    })
  }

  return (
    <SettingsPanelContainer {...props}>
      {rows.map((key) => (
        <Card key={key}>
          <SettingsPanelButton onClick={() => handleClick(key)} disableRipple>
            <SettingsPanelTitle>{labelByKey[key]}</SettingsPanelTitle>
            <SettingsPanelValue>{valueByKey[key]}</SettingsPanelValue>
          </SettingsPanelButton>
        </Card>
      ))}
    </SettingsPanelContainer>
  )
}
