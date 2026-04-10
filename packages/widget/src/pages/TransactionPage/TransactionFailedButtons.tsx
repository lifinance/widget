import type { RouteExtended } from '@lifi/sdk'
import { Box, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useContactSupport } from '../../hooks/useContactSupport.js'
import { useNavigateBack } from '../../hooks/useNavigateBack.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { getSourceTxHash } from '../../stores/routes/utils.js'
import { HiddenUI } from '../../types/widget.js'
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
  const { hiddenUI } = useWidgetConfig()
  const navigateBack = useNavigateBack()
  const supportId = getSourceTxHash(route) ?? route.id
  const handleContactSupport = useContactSupport(supportId)

  const handleRemoveRoute = () => {
    navigateBack()
    deleteRoute()
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Box sx={{ flex: 1 }}>
          <Button onClick={handleRemoveRoute} fullWidth>
            {t('button.remove')}
          </Button>
        </Box>
        <Box sx={{ flex: 1 }}>
          <StartTransactionButton
            text={t('button.tryAgain')}
            onClick={restartRoute}
            route={route}
          />
        </Box>
      </Box>
      {!hiddenUI?.includes(HiddenUI.ContactSupport) ? (
        <Button variant="text" onClick={handleContactSupport} fullWidth>
          {t('button.contactSupport')}
        </Button>
      ) : null}
    </Box>
  )
}
