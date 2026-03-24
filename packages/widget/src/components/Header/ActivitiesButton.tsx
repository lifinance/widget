// import ErrorRounded from '@mui/icons-material/ErrorRounded'
import ReceiptLong from '@mui/icons-material/ReceiptLong'
import { IconButton, Tooltip } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
// import { useRouteExecutionIndicator } from '../../stores/routes/useRouteExecutionIndicators.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
// import { ErrorBadge } from './ActivitiesButton.style.js'

export const ActivitiesButton = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  // const indicator = useRouteExecutionIndicator()

  return (
    <Tooltip title={t('header.activities')}>
      <IconButton
        size="medium"
        onClick={() => navigate({ to: navigationRoutes.activities })}
      >
        {/* <ErrorBadge
          invisible={indicator !== 'failed'}
          badgeContent={
            <ErrorRounded color="error" sx={{ width: 20, height: 20 }} />
          }
          overlap="circular"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        > */}
        <ReceiptLong />
        {/* </ErrorBadge> */}
      </IconButton>
    </Tooltip>
  )
}
