import type { ExecutionAction, LiFiStepExtended } from '@lifi/sdk'
import Done from '@mui/icons-material/Done'
import ErrorRounded from '@mui/icons-material/ErrorRounded'
import OpenInNew from '@mui/icons-material/OpenInNew'
import type React from 'react'
import { useActionMessage } from '../../hooks/useActionMessage.js'
import { useExplorer } from '../../hooks/useExplorer.js'
import {
  ExternalLinkIcon,
  StatusIconCircle,
  TransactionLinkContainer,
  TransactionLinkLabel,
} from './TransactionLink.style.js'

export interface TransactionLinkProps {
  label: string
  href?: string
  failed?: boolean
}

export const TransactionLink: React.FC<TransactionLinkProps> = ({
  label,
  href,
  failed,
}) => {
  return (
    <TransactionLinkContainer>
      <StatusIconCircle failed={failed}>
        {failed ? (
          <ErrorRounded color="error" sx={{ fontSize: 16 }} />
        ) : (
          <Done color="success" sx={{ fontSize: 16 }} />
        )}
      </StatusIconCircle>
      <TransactionLinkLabel>{label}</TransactionLinkLabel>
      {href ? (
        <ExternalLinkIcon href={href} target="_blank" rel="nofollow noreferrer">
          <OpenInNew sx={{ fontSize: 16 }} />
        </ExternalLinkIcon>
      ) : null}
    </TransactionLinkContainer>
  )
}

export const StepTransactionLink: React.FC<{
  step: LiFiStepExtended
  actionsGroup: ExecutionAction[]
}> = ({ step, actionsGroup }) => {
  const action = actionsGroup.at(-1)
  const { title } = useActionMessage(step, action)
  const { getTransactionLink } = useExplorer()

  if (!action || (action.status !== 'DONE' && action.status !== 'FAILED')) {
    return null
  }

  const transactionLink = action.txHash
    ? getTransactionLink({
        txHash: action.txHash,
        chain: action.chainId,
      })
    : action.txLink
      ? getTransactionLink({
          txLink: action.txLink,
          chain: action.chainId,
        })
      : undefined

  return (
    <TransactionLink
      label={title ?? ''}
      href={transactionLink}
      failed={action.status === 'FAILED'}
    />
  )
}
