import ErrorRounded from '@mui/icons-material/ErrorRounded'
import ReceiptLong from '@mui/icons-material/ReceiptLong'
import { IconButton, Tooltip } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useRouteExecutionIndicators } from '../../stores/routes/useRouteExecutionIndicators.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import {
  ErrorBadge,
  ProgressContainer,
  ProgressFill,
  ProgressTrack,
} from './TransactionHistoryButton.style.js'

export const TransactionHistoryButton = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { hasActiveRoutes, hasFailedRoutes } = useRouteExecutionIndicators()

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
                <ProgressTrack
                  variant="determinate"
                  value={100}
                  size={36}
                  thickness={3}
                />
                <ProgressFill
                  variant="determinate"
                  value={25}
                  size={36}
                  thickness={3}
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
