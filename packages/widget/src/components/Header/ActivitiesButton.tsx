import ErrorRounded from '@mui/icons-material/ErrorRounded'
import HistoryIcon from '@mui/icons-material/History'
import { IconButton, Tooltip } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useRouteExecutionIndicator } from '../../stores/routes/useRouteExecutionIndicators.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { CircularProgressPending } from '../Step/CircularProgress.style.js'
import {
  ErrorBadge,
  IconContainer,
  ProgressTrack,
} from './ActivitiesButton.style.js'

export const ActivitiesButton = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const indicator = useRouteExecutionIndicator()

  return (
    <Tooltip title={t('header.activities')}>
      <IconButton
        size="medium"
        onClick={() => navigate({ to: navigationRoutes.activities })}
      >
        <ErrorBadge
          invisible={!indicator.failed}
          badgeContent={
            <ErrorRounded color="error" sx={{ width: 20, height: 20 }} />
          }
          overlap="circular"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <IconContainer>
            {(indicator.active || indicator.failed) && (
              <ProgressTrack
                variant="determinate"
                value={100}
                size={40}
                thickness={3}
              />
            )}
            {indicator.active && (
              <CircularProgressPending
                size={40}
                sx={{ position: 'absolute', top: -8, left: -8 }}
              />
            )}
            <HistoryIcon />
          </IconContainer>
        </ErrorBadge>
      </IconButton>
    </Tooltip>
  )
}
