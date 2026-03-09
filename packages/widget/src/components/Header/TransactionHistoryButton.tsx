import ErrorRounded from '@mui/icons-material/ErrorRounded'
import ReceiptLong from '@mui/icons-material/ReceiptLong'
import { CircularProgress, IconButton, Tooltip } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useExecutingRoutesIds } from '../../stores/routes/useExecutingRoutesIds.js'
import { useHasFailedRoutes } from '../../stores/routes/useHasFailedRoutes.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import {
  ErrorBadge,
  ProgressContainer,
} from './TransactionHistoryButton.style.js'

const progressTrackSx = (theme: import('@mui/material').Theme) => ({
  position: 'absolute' as const,
  color: theme.vars.palette.grey[300],
  ...theme.applyStyles('dark', {
    color: theme.vars.palette.grey[800],
  }),
})

const progressFillSx = (theme: import('@mui/material').Theme) => ({
  position: 'absolute' as const,
  color: theme.vars.palette.primary.main,
  ...theme.applyStyles('dark', {
    color: theme.vars.palette.primary.light,
  }),
})

export const TransactionHistoryButton = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const hasFailedRoutes = useHasFailedRoutes()
  const executingRouteIds = useExecutingRoutesIds()
  const hasActiveRoutes = executingRouteIds.length > 0

  return (
    <Tooltip title={t('header.transactionHistory')}>
      <IconButton
        size="medium"
        onClick={() => navigate({ to: navigationRoutes.transactionHistory })}
      >
        <ErrorBadge
          invisible={!hasFailedRoutes}
          badgeContent={
            <ErrorRounded color="error" sx={{ width: 16, height: 16 }} />
          }
          overlap="circular"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <ProgressContainer>
            {hasActiveRoutes ? (
              <>
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={36}
                  thickness={3}
                  sx={progressTrackSx}
                />
                <CircularProgress
                  variant="determinate"
                  value={25}
                  size={36}
                  thickness={3}
                  sx={progressFillSx}
                />
              </>
            ) : null}
            <ReceiptLong />
          </ProgressContainer>
        </ErrorBadge>
      </IconButton>
    </Tooltip>
  )
}
