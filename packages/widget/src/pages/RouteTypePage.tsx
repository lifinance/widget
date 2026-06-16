import Check from '@mui/icons-material/Check'
import { List } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ListItemText } from '../components/ListItemText.js'
import { PageContainer } from '../components/PageContainer.js'
import { SettingsListItemButton } from '../components/SettingsListItemButton.js'
import { useHeader } from '../hooks/useHeader.js'
import { RouteTypes } from '../stores/settings/types.js'
import { useSettings } from '../stores/settings/useSettings.js'
import { useSettingsActions } from '../stores/settings/useSettingsActions.js'

export const RouteTypePage: React.FC = () => {
  const { t } = useTranslation()
  const { setValue } = useSettingsActions()
  const { routeType } = useSettings(['routeType'])
  const currentRouteType = routeType ?? 'all'

  useHeader(t('settings.routeType.title'))

  return (
    <PageContainer disableGutters>
      <List
        sx={{
          padding: 1.5,
        }}
      >
        {RouteTypes.map((type) => (
          <SettingsListItemButton
            key={type}
            onClick={() => setValue('routeType', type)}
          >
            <ListItemText
              primary={t(`settings.routeType.${type}.title`)}
              secondary={t(`settings.routeType.${type}.description`)}
            />
            {currentRouteType === type && <Check color="primary" />}
          </SettingsListItemButton>
        ))}
      </List>
    </PageContainer>
  )
}
