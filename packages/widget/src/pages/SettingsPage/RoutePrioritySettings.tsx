import Route from '@mui/icons-material/Route'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { CardButton } from '../../components/Card/CardButton.js'
import { useSettingMonitor } from '../../hooks/useSettingMonitor.js'
import { useSettings } from '../../stores/settings/useSettings.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { BadgedValue } from './SettingsCard/BadgedValue.js'

export const RoutePrioritySettings: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isRoutePriorityChanged } = useSettingMonitor()
  const { routePriority } = useSettings(['routePriority'])
  const currentRoutePriority = (routePriority ?? 'CHEAPEST').toLowerCase()

  const handleClick = () => {
    navigate({ to: navigationRoutes.routePriority })
  }

  return (
    <CardButton
      onClick={handleClick}
      icon={<Route />}
      title={t('settings.routePriority')}
    >
      <BadgedValue badgeColor="info" showBadge={isRoutePriorityChanged}>
        {t(
          `settings.routePriorityOptions.${currentRoutePriority}.title` as any
        )}
      </BadgedValue>
    </CardButton>
  )
}
