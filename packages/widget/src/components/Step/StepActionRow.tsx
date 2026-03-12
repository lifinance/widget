import type { ExecutionAction, LiFiStepExtended } from '@lifi/sdk'
import OpenInNew from '@mui/icons-material/OpenInNew'
import type React from 'react'
import { useActionMessage } from '../../hooks/useActionMessage.js'
import { useExplorer } from '../../hooks/useExplorer.js'
import { ExternalLink } from '../../pages/TransactionPage/Receipts.style.js'
import { ActionRow } from '../ActionRow/ActionRow.js'

export const StepActionRow: React.FC<{
  step: LiFiStepExtended
  actionsGroup: ExecutionAction[]
}> = ({ step, actionsGroup }) => {
  const action = actionsGroup.at(-1)
  const { title } = useActionMessage(step, action)
  const { getTransactionLink } = useExplorer()

  const isDone = action?.status === 'DONE'
  const isFailed = action?.status === 'FAILED'

  const transactionLink = action?.txHash
    ? getTransactionLink({ txHash: action.txHash, chain: action.chainId })
    : action?.txLink
      ? getTransactionLink({ txLink: action.txLink, chain: action.chainId })
      : undefined

  if (!isDone && !isFailed && !transactionLink) {
    return null
  }

  return (
    <ActionRow
      variant={isFailed ? 'error' : 'success'}
      message={title ?? ''}
      endAdornment={
        <ExternalLink
          href={transactionLink}
          target="_blank"
          rel="nofollow noreferrer"
        >
          <OpenInNew sx={{ fontSize: 16 }} />
        </ExternalLink>
      }
    />
  )
}
