import type { RouteExtended } from '@lifi/sdk'
import { useExplorer } from '../../hooks/useExplorer.js'
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
}) => {
  const { getTransactionLink } = useExplorer()
  const stepRows = route.steps
    .map((step) => {
      const rows = prepareActions(step.execution?.actions ?? [])
        .map((actionsGroup) => {
          const action = actionsGroup.at(-1)
          const href = action?.txHash
            ? getTransactionLink({
                txHash: action.txHash,
                chain: action.chainId,
              })
            : action?.txLink
              ? getTransactionLink({
                  txLink: action.txLink,
                  chain: action.chainId,
                })
              : undefined
          return { action, href }
        })
        .filter(({ action, href }) => {
          const doneOrFailed =
            action?.status === 'DONE' || action?.status === 'FAILED'
          return Boolean(href && doneOrFailed)
        })
      return { step, rows }
    })
    .filter(({ rows }) => rows.length > 0)

  if (!stepRows?.length) {
    return null
  }

  const lastStepIndex = stepRows.length - 1

  return (
    <TransactionList>
      {stepRows.map(({ step, rows }, stepIndex) => {
        const lastRowIndex = rows.length - 1
        const isLastStep = stepIndex === lastStepIndex
        return (
          <TransactionList key={step.id}>
            {rows.map(({ action, href }, rowIndex) => (
              <StepActionRow
                key={rowIndex}
                step={step}
                action={action!}
                href={href!}
                defaultLabelsOnly={!(isLastStep && rowIndex === lastRowIndex)}
              />
            ))}
          </TransactionList>
        )
      })}
      {toAddress ? (
        <SentToWalletRow toAddress={toAddress} toChainId={route.toChainId} />
      ) : null}
    </TransactionList>
  )
}
