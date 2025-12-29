import type { LiFiStepExtended } from '@lifi/sdk'
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded'
import { Box, Link, Typography } from '@mui/material'
import type React from 'react'
import { Card } from '../../components/Card/Card.js'
import { useExecutionMessage } from '../../hooks/useExecutionMessage.js'
import { useExplorer } from '../../hooks/useExplorer.js'
import { CardIconButton } from '../Card/CardIconButton.js'
import { ExecutionTimer } from './ExecutionTimer.js'
import { CenterContainer, StatusMessage } from './StepExecution.style.js'

export const StepExecution: React.FC<{
  step: LiFiStepExtended
}> = ({ step }) => {
  return (
    <Card type={step.execution?.status === 'FAILED' ? 'error' : 'default'}>
      <Box
        sx={{
          py: 1,
        }}
      >
        <StepProcess step={step} />
      </Box>
    </Card>
  )
}

const StepProcess: React.FC<{
  step: LiFiStepExtended
}> = ({ step }) => {
  const { title, message } = useExecutionMessage(step)
  const { getTransactionLink } = useExplorer()

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

  return (
    <Box
      sx={{
        px: 2,
        py: 1,
      }}
    >
      <CenterContainer>
        <ExecutionTimer
          step={step}
          estimatedDuration={step.estimate.executionDuration}
        />
        <StatusMessage>{title}</StatusMessage>
        <StatusMessage>{message}</StatusMessage>
        {transactionsWithLinks?.map((transactionWithLink, idx) => (
          <Box key={`${transactionWithLink.transactionLink}-${idx}`}>
            <Typography>{transactionWithLink.transaction.type}</Typography>
            <CardIconButton
              size="small"
              LinkComponent={Link}
              href={transactionWithLink.transactionLink}
              target="_blank"
              rel="nofollow noreferrer"
            >
              <OpenInNewRounded fontSize="inherit" />
            </CardIconButton>
          </Box>
        ))}
      </CenterContainer>
    </Box>
  )
}
