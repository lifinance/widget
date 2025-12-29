import type { LiFiStepExtended } from '@lifi/sdk'
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded'
import { Box, Link, Typography } from '@mui/material'
import { useExecutionMessage } from '../../hooks/useExecutionMessage.js'
import { useExplorer } from '../../hooks/useExplorer.js'
import { CardIconButton } from '../Card/CardIconButton.js'
import { CircularProgress } from './CircularProgress.js'

export const StepProcess: React.FC<{
  step: LiFiStepExtended
}> = ({ step }) => {
  const { title, message } = useExecutionMessage(step)
  const { getTransactionLink } = useExplorer()

  const transaction = step?.execution?.transactions.find(
    (transaction) => transaction.type === step.execution?.type
  )
  const transactionLink = transaction?.txHash
    ? getTransactionLink({
        txHash: transaction.txHash,
        chain: transaction.chainId,
      })
    : transaction?.txLink
      ? getTransactionLink({
          txLink: transaction.txLink,
          chain: transaction.chainId,
        })
      : undefined

  return (
    <Box
      sx={{
        px: 2,
        py: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {step?.execution && <CircularProgress execution={step.execution} />}
        <Typography
          sx={{
            marginLeft: 2,
            marginRight: 0.5,
            flex: 1,
            fontSize: 14,
            fontWeight: step?.execution?.error ? 600 : 400,
          }}
        >
          {title}
        </Typography>
        {transactionLink ? (
          <CardIconButton
            size="small"
            LinkComponent={Link}
            href={transactionLink}
            target="_blank"
            rel="nofollow noreferrer"
          >
            <OpenInNewRounded fontSize="inherit" />
          </CardIconButton>
        ) : null}
      </Box>
      {message ? (
        <Typography
          sx={{
            ml: 7,
            fontSize: 14,
            fontWeight: 500,
            color: 'text.secondary',
          }}
        >
          {message}
        </Typography>
      ) : null}
    </Box>
  )
}
