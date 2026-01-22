import type { LiFiStepExtended, Transaction } from '@lifi/sdk'
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded'
import { Box, Link, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { getTransactionTitle } from '../../hooks/useExecutionMessage.js'
import { useExplorer } from '../../hooks/useExplorer.js'
import { CardIconButton } from '../Card/CardIconButton.js'
import { CircularProgress } from './CircularProgress.js'

export const StepTransaction: React.FC<{
  step: LiFiStepExtended
  transaction: Transaction
}> = ({ step, transaction }) => {
  const { t } = useTranslation()
  const title = getTransactionTitle(t, step, transaction.type)
  const { getTransactionLink } = useExplorer()

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

  const substatus =
    step.execution?.type === transaction.type
      ? step.execution?.substatus
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
