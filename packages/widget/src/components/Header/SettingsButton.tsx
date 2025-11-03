import Settings from '@mui/icons-material/Settings'
import { Tooltip } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useSettingMonitor } from '../../hooks/useSettingMonitor.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import {
  SettingsIconBadge,
  SettingsIconButton,
} from './SettingsButton.style.js'

export const SettingsButton = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { isCustomRouteSettings, isRouteSettingsWithWarnings } =
    useSettingMonitor()

  const variant = isRouteSettingsWithWarnings
    ? 'warning'
    : isCustomRouteSettings
      ? 'info'
      : undefined

  const tooltipMessage = variant
    ? t('tooltip.settingsModified')
    : t('header.settings')

  return (
    <Tooltip title={tooltipMessage}>
      <SettingsIconButton
        size="medium"
        onClick={() => navigate({ to: navigationRoutes.settings })}
        variant={variant}
      >
        {variant ? (
          <SettingsIconBadge variant="dot" color={variant}>
            <Settings />
          </SettingsIconBadge>
        ) : (
          <Settings />
        )}
      </SettingsIconButton>
    </Tooltip>
  )
}
