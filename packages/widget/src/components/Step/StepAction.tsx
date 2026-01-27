import type { ExecutionAction, LiFiStep } from '@lifi/sdk'
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded'
import { Box, Link, Typography } from '@mui/material'
import { useActionMessage } from '../../hooks/useActionMessage.js'
import { useExplorer } from '../../hooks/useExplorer.js'
import { CardIconButton } from '../Card/CardIconButton.js'
import { CircularProgress } from './CircularProgress.js'

export const StepAction: React.FC<{
  step: LiFiStep
  action: ExecutionAction
}> = ({ step, action }) => {
  const { title, message } = useActionMessage(step, action)
  const { getTransactionLink } = useExplorer()

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
        <CircularProgress action={action} />
        <Typography
          sx={{
            marginLeft: 2,
            marginRight: 0.5,
            flex: 1,
            fontSize: 14,
            fontWeight: action.error ? 600 : 400,
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
