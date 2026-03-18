import type { RouteExtended } from '@lifi/sdk'
import { Box } from '@mui/material'
import { Card } from '../../components/Card/Card.js'
import { ExecutionProgress } from '../../components/ExecutionProgress/ExecutionProgress.js'
import { RouteTokens } from '../../components/RouteCard/RouteTokens.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { RouteExecutionStatus } from '../../stores/routes/types.js'
import { hasEnumFlag } from '../../utils/enum.js'
import { ExecutionDoneCard } from './ExecutionDoneCard.js'
import { StepActionsList } from './StepActionsList.js'

interface ExecutionProgressCardsProps {
  route: RouteExtended
  status: RouteExecutionStatus
}

export const ExecutionProgressCards: React.FC<ExecutionProgressCardsProps> = ({
  route,
  status,
}) => {
  const { feeConfig } = useWidgetConfig()
  const isDone = hasEnumFlag(status, RouteExecutionStatus.Done)
  const toAddress = isDone ? route.toAddress : undefined
  const hasActions = route.steps.some(
    (step) => (step.execution?.actions?.length ?? 0) > 0
  )
  const hasListItems = hasActions || !!toAddress
  const VcComponent =
    status === RouteExecutionStatus.Done ? feeConfig?._vcComponent : undefined

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Card type="default" indented>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ExecutionProgress route={route} status={status} />
          {hasListItems ? (
            <StepActionsList route={route} toAddress={toAddress} />
          ) : null}
        </Box>
      </Card>
      {isDone ? (
        <ExecutionDoneCard route={route} status={status} />
      ) : (
        <Card type="default" indented>
          <RouteTokens route={route} />
        </Card>
      )}
      {VcComponent ? <VcComponent route={route} /> : null}
    </Box>
  )
}
