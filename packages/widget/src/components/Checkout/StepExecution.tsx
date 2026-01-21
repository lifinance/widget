import type { LiFiStepExtended, TransactionType } from '@lifi/sdk'
import { Box, Typography } from '@mui/material'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '../../components/Card/Card.js'
import { useExecutionMessage } from '../../hooks/useExecutionMessage.js'
import { useExplorer } from '../../hooks/useExplorer.js'
import { CircularProgress } from '../Step/CircularProgress.js'
import { TransactionLink } from '../Step/TransactionLink.js'

const transactionTypeDoneKeys: Record<TransactionType, string> = {
  TOKEN_ALLOWANCE: 'main.process.tokenAllowance.done',
  PERMIT: 'main.process.permit.done',
  SWAP: 'main.process.swap.done',
  CROSS_CHAIN: 'main.process.bridge.done',
  RECEIVING_CHAIN: 'main.process.receivingChain.done',
}

export const StepExecution: React.FC<{
  step: LiFiStepExtended
}> = ({ step }) => {
  const { t } = useTranslation()
  const { title } = useExecutionMessage(step)
  const { getTransactionLink } = useExplorer()

  if (!step.execution) {
    return null
  }

  const transactionsWithLinks = step.execution?.transactions.flatMap(
    (transaction) => {
      const transactionLink = transaction.txHash
        ? getTransactionLink({
            txHash: transaction.txHash,
            chain: step.execution?.chainId,
          })
        : transaction.txLink
          ? getTransactionLink({
              txLink: transaction.txLink,
              chain: step.execution?.chainId,
            })
          : undefined
      return transactionLink ? [{ transaction, transactionLink }] : []
    }
  )

  // TODO: title or message?

  return (
    <Card
      type="default"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        px: 3,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <CircularProgress step={step} />
      </Box>
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 500,
          color: 'text.primary',
          textAlign: 'center',
        }}
      >
        {title}
      </Typography>
      {!!transactionsWithLinks?.length && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            width: '100%',
            mt: 2,
          }}
        >
          {transactionsWithLinks.map((transactionWithLink, idx) => {
            const txType = transactionWithLink.transaction.type
            const label = t(transactionTypeDoneKeys[txType] as any, {
              tokenSymbol: step.action.fromToken.symbol,
            })
            return (
              <TransactionLink
                key={`${transactionWithLink.transactionLink}-${idx}`}
                label={label}
                href={transactionWithLink.transactionLink}
              />
            )
          })}
        </Box>
      )}
    </Card>
  )
}
