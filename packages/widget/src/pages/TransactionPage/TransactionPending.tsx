import type { RouteExtended } from '@lifi/sdk'
import { Card } from '../../components/Card/Card.js'
import { ExecutionProgress } from '../../components/Step/ExecutionProgress.js'
import { RouteTokens } from '../../components/Step/RouteTokens.js'
import { StepActionRow } from '../../components/Step/StepActionRow.js'
import { prepareActions } from '../../utils/prepareActions.js'
import { TransactionList } from './Receipts.style.js'

interface TransactionPendingProps {
  route: RouteExtended
}

export const TransactionPending: React.FC<TransactionPendingProps> = ({
  route,
}) => (
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
    <Card type="default" indented>
      <RouteTokens route={route} />
    </Card>
  </>
)
