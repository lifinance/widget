import type { ExecutionAction, LiFiStepExtended } from '@lifi/sdk'
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded'
import { Box, Link, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { getTransactionTitle } from '../../hooks/useExecutionMessage.js'
import { useExplorer } from '../../hooks/useExplorer.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { CardIconButton } from '../Card/CardIconButton.js'
import { CircularProgress } from './CircularProgress.js'

export const StepExecutionAction: React.FC<{
  step: LiFiStepExtended
  action: ExecutionAction
}> = ({ step, action }) => {
  const { t } = useTranslation()
  const { subvariant, subvariantOptions } = useWidgetConfig()
  const title = getTransactionTitle(
    t,
    step,
    action.type,
    subvariant,
    subvariantOptions
  )
  const { getTransactionLink } = useExplorer()

  if (!action.isDone) {
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

  const substatus =
    step.execution?.type === action.type ? step.execution?.substatus : undefined

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
        <CircularProgress status={'DONE'} substatus={substatus} />
        <Typography
          sx={{
            marginLeft: 2,
            marginRight: 0.5,
            flex: 1,
            fontSize: 14,
            fontWeight: 400,
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
    </Box>
  )
}
