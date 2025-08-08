import type { Order } from '@lifi/sdk'
import Route from '@mui/icons-material/Route'
import { useTranslation } from 'react-i18next'
import { CardTabs, Tab } from '../../components/Tabs/Tabs.style.js'
import { useSettingMonitor } from '../../hooks/useSettingMonitor.js'
import { useSettings } from '../../stores/settings/useSettings.js'
import { useSettingsActions } from '../../stores/settings/useSettingsActions.js'
import { BadgedValue } from './SettingsCard/BadgedValue.js'
import { SettingCardExpandable } from './SettingsCard/SettingCardExpandable.js'

const Priorities: Order[] = ['CHEAPEST', 'FASTEST']

export const RoutePrioritySettings: React.FC = () => {
  const { t } = useTranslation()
  const { setValue } = useSettingsActions()
  const { isRoutePriorityChanged } = useSettingMonitor()
  const { routePriority } = useSettings(['routePriority'])
  const currentRoutePriority = routePriority ?? ''

  const handleRoutePriorityChange = (
    _: React.SyntheticEvent,
    routePriority: Order
  ) => {
    setValue('routePriority', routePriority)
  }

  return (
    <SettingCardExpandable
      value={
        <BadgedValue badgeColor="info" showBadge={isRoutePriorityChanged}>
          {t(`main.tags.${currentRoutePriority.toLowerCase()}` as any)}
        </BadgedValue>
      }
      icon={<Route />}
      title={t('settings.routePriority')}
    >
      <CardTabs
        value={currentRoutePriority}
        aria-label="tabs"
        indicatorColor="primary"
        onChange={handleRoutePriorityChange}
        sx={{ mt: 1.5 }}
      >
        {Priorities.map((priority) => {
          return (
            <Tab
              key={priority}
              label={t(`main.tags.${priority.toLowerCase()}` as any)}
              value={priority}
              disableRipple
            />
          )
        })}
      </CardTabs>
    </SettingCardExpandable>
  )
}
