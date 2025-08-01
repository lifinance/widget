import type { LiFiStep, Process } from '@lifi/sdk'
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded'
import { Box, Link, Typography } from '@mui/material'
import { useExplorer } from '../../hooks/useExplorer.js'
import { useProcessMessage } from '../../hooks/useProcessMessage.js'
import { CardIconButton } from '../Card/CardIconButton.js'
import { CircularProgress } from './CircularProgress.js'

export const StepProcess: React.FC<{
  step: LiFiStep
  process: Process
}> = ({ step, process }) => {
  const { title, message } = useProcessMessage(step, process)
  const { getTransactionLink } = useExplorer()

  const transactionLink = process.txHash
    ? getTransactionLink({
        txHash: process.txHash,
        chain: process.chainId,
      })
    : process.txLink
      ? getTransactionLink({
          txLink: process.txLink,
          chain: process.chainId,
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
        <CircularProgress process={process} />
        <Typography
          sx={{
            marginLeft: 2,
            marginRight: 0.5,
            flex: 1,
            fontSize: 14,
            fontWeight: process.error ? 600 : 400,
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
