import type { Route, TokenAmount } from '@lifi/sdk'
import { Card, CardTitle, Token, useExplorer } from '@lifi/widget/shared'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { Box, Button, Stack, Typography } from '@mui/material'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { StatusStepList } from './StatusStepList.js'

interface StatusCompletedProps {
  /** Order result fields — there is no live StatusResponse in the order-driven page. */
  toAmount?: string
  toTxHash?: string
  toChainId?: number
  onSeeDetails: () => void
  onDone: () => void
  frozenRoute?: Route
  recipientAddress?: string | null
}

const ICON_SIZE = 96

export function StatusCompleted({
  toAmount,
  toTxHash,
  toChainId,
  onSeeDetails,
  onDone,
  frozenRoute,
  recipientAddress,
}: StatusCompletedProps): JSX.Element {
  const { t } = useTranslation()
  const { getTransactionLink } = useExplorer()

  const receivingToken = frozenRoute?.toToken
  const receivingTokenAmount: TokenAmount | undefined =
    toAmount && receivingToken
      ? ({
          ...receivingToken,
          amount: BigInt(toAmount),
        } as TokenAmount)
      : undefined
  const receivingTxLink = toTxHash
    ? getTransactionLink({
        txHash: toTxHash,
        chain: frozenRoute?.toChainId ?? toChainId,
      })
    : undefined

  return (
    <Stack spacing={1.5} sx={{ flex: 1 }}>
      <Card variant="elevation" indented sx={{ p: 3, filter: 'none' }}>
        <Stack
          spacing={2}
          sx={{ alignItems: 'center', textAlign: 'center', pb: 2 }}
        >
          <Box
            sx={(theme) => ({
              width: ICON_SIZE,
              height: ICON_SIZE,
              borderRadius: '50%',
              padding: '4px',
              border: `3px solid ${theme.vars.palette.success.main}`,
              color: theme.vars.palette.success.main,
            })}
          >
            <Box
              sx={(theme) => ({
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: `color-mix(in srgb, ${theme.vars.palette.success.main} 18%, white)`,
              })}
            >
              <CheckRoundedIcon sx={{ fontSize: 44, strokeWidth: 2 }} />
            </Box>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {t('checkout.transactionStatus.success')}
          </Typography>
        </Stack>
        <StatusStepList
          phase="done"
          frozenRoute={frozenRoute}
          recipientAddress={recipientAddress}
          receivingTxLink={receivingTxLink}
          toChainId={toChainId}
        />
      </Card>

      {receivingTokenAmount ? (
        <Card variant="elevation" indented sx={{ p: 3, filter: 'none' }}>
          <CardTitle sx={{ p: 0, mb: 1.5 }}>{t('header.received')}</CardTitle>
          <Token token={receivingTokenAmount} disableDescription={false} />
        </Card>
      ) : null}

      <Stack direction="row" spacing={2} sx={{ pt: 1.5 }}>
        <Button
          variant="text"
          fullWidth
          size="large"
          onClick={onSeeDetails}
          sx={{ flex: 1 }}
        >
          {t('checkout.transactionStatus.seeDetails')}
        </Button>
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={onDone}
          sx={{ flex: 1 }}
        >
          {t('button.done')}
        </Button>
      </Stack>
    </Stack>
  )
}
