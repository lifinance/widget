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
        {routePriority === 'FASTEST'
          ? t('settings.routePriorityOptions.fastest.title')
          : t('settings.routePriorityOptions.cheapest.title')}
      </BadgedValue>
    </CardButton>
  )
}
