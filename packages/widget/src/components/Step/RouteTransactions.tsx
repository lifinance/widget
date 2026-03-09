import type { RouteExtended } from '@lifi/sdk'
import { Box } from '@mui/material'
import { prepareActions } from '../../utils/prepareActions.js'
import { StepTransactionLink } from './TransactionLink.js'

export const RouteTransactions: React.FC<{
  route: RouteExtended
}> = ({ route }) => {
  return (
    <Box>
      {route.steps.map((step) => (
        <Box key={step.id}>
          {prepareActions(step.execution?.actions ?? []).map(
            (actionsGroup, index) => (
              <StepTransactionLink
                key={index}
                step={step}
                actionsGroup={actionsGroup}
              />
            )
          )}
        </Box>
      ))}
    </Box>
  )
}
