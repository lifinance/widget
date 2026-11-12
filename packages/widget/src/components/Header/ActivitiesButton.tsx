import ErrorRounded from '@mui/icons-material/ErrorRounded'
import HistoryIcon from '@mui/icons-material/History'
import { Tooltip } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouteExecutionIndicator } from '../../stores/routes/useRouteExecutionIndicator.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import {
  CircularProgressPending,
  ProgressTrack,
} from '../Timer/StepStatusTimer.style.js'
import {
  ActivitiesIconButton,
  ErrorBadge,
  IconContainer,
  ProgressRing,
  progressRingSize,
} from './ActivitiesButton.style.js'

export const ActivitiesButton = (): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const indicator = useRouteExecutionIndicator()

  return (
    <Tooltip title={t('header.activities')}>
      <ActivitiesIconButton
        active={indicator.active || indicator.failed}
        size="medium"
        onClick={() => navigate({ to: navigationRoutes.activities })}
        disableRipple={indicator.active || indicator.failed}
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
              <ProgressRing>
                <ProgressTrack
                  variant="determinate"
                  value={100}
                  size={progressRingSize}
                  thickness={3}
                />
                {indicator.active && (
                  <CircularProgressPending size={progressRingSize} />
                )}
              </ProgressRing>
            )}
            <HistoryIcon />
          </IconContainer>
        </ErrorBadge>
      </ActivitiesIconButton>
    </Tooltip>
  )
}
