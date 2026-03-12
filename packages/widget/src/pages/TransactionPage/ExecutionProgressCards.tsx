import type { RouteExtended } from '@lifi/sdk'
import { Box } from '@mui/material'
import { Card } from '../../components/Card/Card.js'
import { ExecutionProgress } from '../../components/Step/ExecutionProgress.js'
import { RouteTokens } from '../../components/Step/RouteTokens.js'
import { StepActionRow } from '../../components/Step/StepActionRow.js'
import type { RouteExecutionStatus } from '../../stores/routes/types.js'
import { prepareActions } from '../../utils/prepareActions.js'
import { TransactionList } from './Receipts.style.js'

interface ExecutionProgressCardsProps {
  route: RouteExtended
  status: RouteExecutionStatus
}

export const ExecutionProgressCards: React.FC<ExecutionProgressCardsProps> = ({
  route,
  status,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Card type="default" indented>
        <Box sx={{ p: 1 }}>
          <ExecutionProgress route={route} status={status} />
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
        </Box>
      </Card>
      <Card type="default" indented>
        <RouteTokens route={route} />
      </Card>
    </Box>
  )
}
