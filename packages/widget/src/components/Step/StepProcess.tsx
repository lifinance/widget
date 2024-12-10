import type { LiFiStep, Process } from '@lifi/sdk'
import { OpenInNewRounded } from '@mui/icons-material'
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

  return (
    <Box px={2} py={1}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <CircularProgress process={process} />
        <Typography
          ml={2}
          mr={0.5}
          flex={1}
          fontSize={14}
          fontWeight={process.error ? 600 : 400}
        >
          {title}
        </Typography>
        {process.txHash || process.txLink ? (
          <CardIconButton
            size="small"
            LinkComponent={Link}
            href={
              process.txHash
                ? getTransactionLink({
                    txHash: process.txHash,
                    chain: process.chainId,
                  })
                : getTransactionLink({
                    txLink: process.txLink!,
                    chain: process.chainId,
                  })
            }
            target="_blank"
            rel="nofollow noreferrer"
          >
            <OpenInNewRounded fontSize="inherit" />
          </CardIconButton>
        ) : null}
      </Box>
      {message ? (
        <Typography
          ml={7}
          fontSize={14}
          fontWeight={500}
          color="text.secondary"
        >
          {message}
        </Typography>
      ) : null}
    </Box>
  )
}
