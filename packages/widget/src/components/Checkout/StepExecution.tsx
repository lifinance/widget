import type { LiFiStepExtended } from '@lifi/sdk'
import { Box, Typography } from '@mui/material'
import type React from 'react'
import { Card } from '../../components/Card/Card.js'
import { useExecutionMessage } from '../../hooks/useExecutionMessage.js'
import { useExplorer } from '../../hooks/useExplorer.js'
import { CircularProgress } from '../Step/CircularProgress.js'
import { TransactionLink } from '../Step/TransactionLink.js'

export const StepExecution: React.FC<{
  step: LiFiStepExtended
}> = ({ step }) => {
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
            chain: transaction.chainId,
          })
        : transaction.txLink
          ? getTransactionLink({
              txLink: transaction.txLink,
              chain: transaction.chainId,
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
          {transactionsWithLinks.map((transactionWithLink, idx) => (
            <TransactionLink
              key={`${transactionWithLink.transactionLink}-${idx}`}
              label={transactionWithLink.transaction.type}
              href={transactionWithLink.transactionLink}
            />
          ))}
        </Box>
      )}
    </Card>
  )
}
