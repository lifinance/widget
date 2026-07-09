import Percent from '@mui/icons-material/Percent'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { CardButton } from '../../../components/Card/CardButton.js'
import { useSettingMonitor } from '../../../hooks/useSettingMonitor.js'
import { useSettings } from '../../../stores/settings/useSettings.js'
import { navigationRoutes } from '../../../utils/navigationRoutes.js'
import { BadgedValue } from '../SettingsCard/BadgedValue.js'

export const SlippageSettings: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isSlippageNotRecommended, isSlippageChanged } = useSettingMonitor()
  const { slippage } = useSettings(['slippage'])

  const badgeColor = isSlippageNotRecommended
    ? 'warning'
    : isSlippageChanged
      ? 'info'
      : undefined

  const handleClick = () => {
    navigate({ to: navigationRoutes.slippage })
  }

  return (
    <CardButton
      onClick={handleClick}
      icon={<Percent />}
      title={t('settings.slippage')}
    >
      <BadgedValue badgeColor={badgeColor} showBadge={!!badgeColor}>
        {slippage ? `${slippage}%` : t('button.auto')}
      </BadgedValue>
    </CardButton>
  )
}
