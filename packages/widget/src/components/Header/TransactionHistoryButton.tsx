import ErrorRounded from '@mui/icons-material/ErrorRounded'
import ReceiptLong from '@mui/icons-material/ReceiptLong'
import { Tooltip } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useRouteExecutionIndicator } from '../../stores/routes/useRouteExecutionIndicators.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { ProgressFill, ProgressTrack } from '../Timer/StepStatusTimer.style.js'
import {
  ErrorBadge,
  HistoryIconButton,
  ProgressContainer,
} from './TransactionHistoryButton.style.js'

export const TransactionHistoryButton = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const indicator = useRouteExecutionIndicator()

  return (
    <Tooltip title={t('header.transactionHistory')}>
      <HistoryIconButton
        indicator={indicator}
        size="medium"
        onClick={() => navigate({ to: navigationRoutes.transactionHistory })}
      >
        <ErrorBadge
          invisible={indicator !== 'failed'}
          badgeContent={
            <ErrorRounded color="error" sx={{ width: 20, height: 20 }} />
          }
          overlap="circular"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <ProgressContainer>
            {indicator !== 'idle' ? (
              <>
                <ProgressTrack
                  variant="determinate"
                  value={100}
                  size={40}
                  thickness={2}
                />
                <ProgressFill
                  variant="determinate"
                  value={25}
                  size={40}
                  thickness={2}
                />
              </>
            ) : null}
            <ReceiptLong />
          </ProgressContainer>
        </ErrorBadge>
      </HistoryIconButton>
    </Tooltip>
  )
}
