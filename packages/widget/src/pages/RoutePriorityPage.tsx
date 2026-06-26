import type { Order } from '@lifi/sdk'
import Check from '@mui/icons-material/Check'
import { List } from '@mui/material'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ListItemText } from '../components/ListItemText.js'
import { PageContainer } from '../components/PageContainer.js'
import { SettingsListItemButton } from '../components/SettingsListItemButton.js'
import { useHeader } from '../hooks/useHeader.js'
import { useListHeight } from '../hooks/useListHeight.js'
import { useSettings } from '../stores/settings/useSettings.js'
import { useSettingsActions } from '../stores/settings/useSettingsActions.js'

const routePriorities: Order[] = ['CHEAPEST', 'FASTEST']

export const RoutePriorityPage: React.FC = () => {
  const { t } = useTranslation()
  const { setValue } = useSettingsActions()
  const { routePriority } = useSettings(['routePriority'])
  const listParentRef = useRef<HTMLUListElement | null>(null)
  const { listHeight } = useListHeight({ listParentRef })

  useHeader(t('settings.routePriority'))

  return (
    <PageContainer disableGutters>
      <List
        className="long-list"
        ref={listParentRef}
        style={{ height: listHeight, overflow: 'auto' }}
        sx={{
          padding: 1.5,
        }}
      >
        {routePriorities.map((priority) => {
          const key = priority.toLowerCase()
          return (
            <SettingsListItemButton
              key={priority}
              onClick={() => setValue('routePriority', priority)}
            >
              <ListItemText
                primary={t(`settings.routePriorityOptions.${key}.title` as any)}
                secondary={t(
                  `settings.routePriorityOptions.${key}.description` as any
                )}
              />
              {routePriority === priority && <Check color="primary" />}
            </SettingsListItemButton>
          )
        })}
      </List>
    </PageContainer>
  )
}
