import type { RouteExtended } from '@lifi/sdk'
import { Card } from '../../components/Card/Card.js'
import { ExecutionProgress } from '../../components/Step/ExecutionProgress.js'
import { RouteTokens } from '../../components/Step/RouteTokens.js'
import { RouteTransactions } from '../../components/Step/RouteTransactions.js'

interface TransactionPendingProps {
  route: RouteExtended
}

export const TransactionPending: React.FC<TransactionPendingProps> = ({
  route,
}) => (
  <>
    <Card type="default" sx={{ px: 3, py: 5 }}>
      <ExecutionProgress route={route} />
      <RouteTransactions route={route} />
    </Card>
    <Card type="default" sx={{ p: 3 }}>
      <RouteTokens route={route} />
    </Card>
  </>
)
