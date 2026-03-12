import type { RouteExtended } from '@lifi/sdk'
import { Box, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigateBack } from '../../hooks/useNavigateBack.js'
import { StartTransactionButton } from './StartTransactionButton.js'

interface TransactionFailedButtonsProps {
  route: RouteExtended
  restartRoute: () => void
  deleteRoute: () => void
}

export const TransactionFailedButtons: React.FC<
  TransactionFailedButtonsProps
> = ({ route, restartRoute, deleteRoute }) => {
  const { t } = useTranslation()
  const navigateBack = useNavigateBack()

  const handleRemoveRoute = () => {
    navigateBack()
    deleteRoute()
  }

  return (
    <Box sx={{ display: 'flex', gap: 1.5 }}>
      <Box sx={{ flex: 1 }}>
        <Button onClick={handleRemoveRoute} fullWidth>
          {t('button.remove')}
        </Button>
      </Box>
      <Box sx={{ flex: 1 }}>
        <StartTransactionButton
          text={t('button.retry')}
          onClick={restartRoute}
          route={route}
        />
      </Box>
    </Box>
  )
}
