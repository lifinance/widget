import AltRoute from '@mui/icons-material/AltRoute'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { CardButton } from '../../components/Card/CardButton.js'
import { useSettings } from '../../stores/settings/useSettings.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { BadgedValue } from './SettingsCard/BadgedValue.js'

export const RouteTypeSettings: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { routeType } = useSettings(['routeType'])
  const currentRouteType = routeType ?? 'all'

  const handleClick = () => {
    navigate({ to: navigationRoutes.routeType })
  }

  return (
    <CardButton
      onClick={handleClick}
      icon={<AltRoute />}
      title={t('settings.routeType.title')}
    >
      <BadgedValue badgeColor="info" showBadge={currentRouteType !== 'all'}>
        {t(`settings.routeType.${currentRouteType}.title`)}
      </BadgedValue>
    </CardButton>
  )
}
