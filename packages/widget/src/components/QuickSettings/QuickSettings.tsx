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
  QuickSettingButton,
  QuickSettingsContainer,
  QuickSettingTitle,
  QuickSettingValue,
} from './QuickSettings.style.js'
import {
  bridgeQuickSettings,
  type QuickSettingKey,
  quickSettingsConfig,
  swapQuickSettings,
} from './quickSettingsRows.js'

export const QuickSettings: React.FC<BoxProps> = (props): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const splitMode = useSplitMode()
  const { slippage, routePriority, routeType } = useSettings([
    'slippage',
    'routePriority',
    'routeType',
  ])
  const [enabledBridges, totalBridges, enabledExchanges, totalExchanges] =
    useSettingsStore((state) => [
      Object.values(state._enabledBridges).filter(Boolean).length,
      Object.values(state._enabledBridges).length,
      Object.values(state._enabledExchanges).filter(Boolean).length,
      Object.values(state._enabledExchanges).length,
    ])

  const rows = splitMode === 'bridge' ? bridgeQuickSettings : swapQuickSettings

  const valueByKey: Record<QuickSettingKey, string> = {
    routeType: t(`settings.routeType.${routeType ?? 'all'}.title`),
    routePriority: t(
      `settings.routePriorityOptions.${(routePriority ?? 'CHEAPEST').toLowerCase()}.title` as any
    ),
    exchanges: `${enabledExchanges}/${totalExchanges}`,
    bridges: `${enabledBridges}/${totalBridges}`,
    slippage: slippage ? `${slippage}%` : t('button.auto'),
  }

  const handleClick = (key: QuickSettingKey) => {
    const { route } = quickSettingsConfig[key]
    navigate({
      to: `/${navigationRoutes.settings}/${navigationRoutes[route]}`,
    })
  }

  return (
    <QuickSettingsContainer {...props}>
      {rows.map((key) => {
        const { labelKey } = quickSettingsConfig[key]
        return (
          <Card key={key}>
            <QuickSettingButton onClick={() => handleClick(key)} disableRipple>
              <QuickSettingTitle>{t(labelKey as any)}</QuickSettingTitle>
              <QuickSettingValue>{valueByKey[key]}</QuickSettingValue>
            </QuickSettingButton>
          </Card>
        )
      })}
    </QuickSettingsContainer>
  )
}
