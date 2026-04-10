import type { RouteExtended } from '@lifi/sdk'
import { Box } from '@mui/material'
import { SentToWalletRow } from '../../components/StepActions/SentToWalletRow.js'
import { StepActionRow } from '../../components/StepActions/StepActionRow.js'
import { useExplorer } from '../../hooks/useExplorer.js'
import { prepareActions } from '../../utils/prepareActions.js'

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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {stepRows.map(({ step, rows }) => (
        <Box
          key={step.id}
          sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
        >
          {rows.map(({ action, href }, index) => (
            <StepActionRow
              key={index}
              step={step}
              action={action!}
              href={href!}
            />
          ))}
        </Box>
      ))}
      {toAddress ? (
        <SentToWalletRow toAddress={toAddress} toChainId={route.toChainId} />
      ) : null}
    </Box>
  )
}
