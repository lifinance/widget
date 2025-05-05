import AirlineStops from '@mui/icons-material/AirlineStops'
import SwapHoriz from '@mui/icons-material/SwapHoriz'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { shallow } from 'zustand/shallow'
import { CardButton } from '../../components/Card/CardButton.js'
import { useSettingMonitor } from '../../hooks/useSettingMonitor.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useSettingsStore } from '../../stores/settings/useSettingsStore.js'
import { HiddenUI } from '../../types/widget.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
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
  }, shallow)

  const { hiddenUI } = useWidgetConfig()

  if (hiddenUI?.includes(HiddenUI.BridgesSettings)) {
    return null
  }

  const customisationLookUp = {
    Bridges: isBridgesChanged,
    Exchanges: isExchangesChanged,
  }

  const handleClick = () => {
    navigate(navigationRoutes[type.toLowerCase() as 'bridges' | 'exchanges'])
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
