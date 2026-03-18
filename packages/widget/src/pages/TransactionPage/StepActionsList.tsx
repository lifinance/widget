import type { RouteExtended } from '@lifi/sdk'
import { prepareActions } from '../../utils/prepareActions.js'
import { TransactionList } from './ReceiptsCard.style.js'
import { SentToWalletRow } from './SentToWalletRow.js'
import { StepActionRow } from './StepActionRow.js'

interface StepActionsListProps {
  route: RouteExtended
  toAddress?: string
}

export const StepActionsList: React.FC<StepActionsListProps> = ({
  route,
  toAddress,
}) => (
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
    {toAddress ? (
      <SentToWalletRow toAddress={toAddress} toChainId={route.toChainId} />
    ) : null}
  </TransactionList>
)
