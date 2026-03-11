import type { RouteExtended } from '@lifi/sdk'
import { Box, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Card } from '../../components/Card/Card.js'
import { WarningMessages } from '../../components/Messages/WarningMessages.js'
import { ExecutionProgress } from '../../components/Step/ExecutionProgress.js'
import { RouteTokens } from '../../components/Step/RouteTokens.js'
import { StepActionRow } from '../../components/Step/StepActionRow.js'
import { useNavigateBack } from '../../hooks/useNavigateBack.js'
import { prepareActions } from '../../utils/prepareActions.js'
import { TransactionList } from './Receipts.style.js'
import { StartTransactionButton } from './StartTransactionButton.js'

interface TransactionFailedProps {
  route: RouteExtended
  restartRoute: () => void
  deleteRoute: () => void
}

export const TransactionFailed: React.FC<TransactionFailedProps> = ({
  route,
  restartRoute,
  deleteRoute,
}) => {
  const { t } = useTranslation()
  const navigateBack = useNavigateBack()

  const handleRemoveRoute = () => {
    navigateBack()
    deleteRoute()
  }

  return (
    <>
      <Card type="default" sx={{ px: 3, py: 5 }}>
        <ExecutionProgress route={route} />
        <TransactionList>
          {route.steps.map((step) => (
            <TransactionList key={step.id}>
              {prepareActions(step.execution?.actions ?? []).map(
                (actionsGroup, index) => (
                  <StepActionRow
                    key={index}
                    step={step}
                    actionsGroup={actionsGroup}
                  />
                )
              )}
            </TransactionList>
          ))}
        </TransactionList>
      </Card>
      <Card type="default" sx={{ p: 3 }}>
        <RouteTokens route={route} />
      </Card>
      <WarningMessages mt={2} route={route} allowInteraction />
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
    </>
  )
}
