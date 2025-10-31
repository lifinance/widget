import AirlineStops from '@mui/icons-material/AirlineStops'
import SwapHoriz from '@mui/icons-material/SwapHoriz'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { CardButton } from '../../components/Card/CardButton.js'
import { useSettingMonitor } from '../../hooks/useSettingMonitor.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useSettingsStore } from '../../stores/settings/SettingsStore.js'
import { HiddenUI } from '../../types/widget.js'
import { settingsRoutes } from '../../utils/navigationRoutes.js'
import { BadgedValue } from './SettingsCard/BadgedValue.js'

const supportedIcons = {
  Bridges: AirlineStops,
  Exchanges: SwapHoriz,
}

export const BridgeAndExchangeSettings: React.FC<{
  type: 'Bridges' | 'Exchanges'
}> = ({ type }) => {
  const { isBridgesChanged, isExchangesChanged } = useSettingMonitor()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [enabledTools, tools] = useSettingsStore((state) => {
    const enabledTools = Object.values(state[`_enabled${type}`])
    return [enabledTools.filter(Boolean).length, enabledTools.length]
  })

  const { hiddenUI } = useWidgetConfig()

  if (type === 'Bridges' && hiddenUI?.includes(HiddenUI.BridgesSettings)) {
    return null
  }

  const customisationLookUp = {
    Bridges: isBridgesChanged,
    Exchanges: isExchangesChanged,
  }

  const handleClick = () => {
    navigate({
      to: settingsRoutes[type.toLowerCase() as 'bridges' | 'exchanges'],
    })
  }

  const Icon = supportedIcons[type]

  return (
    <CardButton
      onClick={handleClick}
      icon={<Icon />}
      title={t(`settings.enabled${type}`)}
    >
      <BadgedValue
        badgeColor="info"
        showBadge={customisationLookUp[type]}
      >{`${enabledTools}/${tools}`}</BadgedValue>
    </CardButton>
  )
}
