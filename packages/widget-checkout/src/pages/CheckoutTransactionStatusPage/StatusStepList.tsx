import type { ExtendedTransactionInfo, FullStatusData } from '@lifi/sdk'
import {
  ActionRow,
  IconCircle,
  SentToWalletRow,
  useAvailableChains,
  useExplorer,
} from '@lifi/widget/shared'
import OpenInNew from '@mui/icons-material/OpenInNew'
import { Box, CircularProgress, Link, Stack, styled } from '@mui/material'
import { type JSX, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type RowState = 'done' | 'loading' | 'pending'

interface StepRow {
  key: string
  label: string
  state: RowState
  href?: string
}

interface StatusStepListProps {
  status: FullStatusData
  phase: 'pending' | 'done'
}

const ExternalLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  borderRadius: '50%',
  textDecoration: 'none',
  color: theme.vars.palette.text.primary,
  '&:hover': {
    backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
  },
}))

export function StatusStepList({
  status,
  phase,
}: StatusStepListProps): JSX.Element {
  const { t } = useTranslation()
  const { getChainById } = useAvailableChains()
  const { getTransactionLink } = useExplorer()

  const sending = status.sending as ExtendedTransactionInfo
  const receiving = status.receiving as ExtendedTransactionInfo

  const rows = useMemo<StepRow[]>(() => {
    const out: StepRow[] = []
    const sendingTxLink = sending?.txHash
      ? getTransactionLink({
          txHash: sending.txHash,
          chain: sending.chainId,
        })
      : undefined
    const sourceConfirmed = Boolean(sending?.txHash)

    out.push({
      key: 'transferInitiated',
      label: t('checkout.transactionStatus.steps.transferInitiated'),
      state: phase === 'done' || sourceConfirmed ? 'done' : 'loading',
      href: sendingTxLink,
    })

    if (sending?.token?.symbol) {
      out.push({
        key: 'tokenReceived',
        label: t('checkout.transactionStatus.steps.tokenReceived', {
          symbol: sending.token.symbol,
        }),
        state: phase === 'done' || sourceConfirmed ? 'done' : 'loading',
        href: sendingTxLink,
      })
    }

    const includedSteps = sending?.includedSteps ?? []
    includedSteps.forEach((step, i) => {
      if (step.tool === 'feeCollection') {
        return
      }
      const fromChainId = step.fromToken?.chainId
      const toChainId = step.toToken?.chainId
      const isCrossChain =
        typeof fromChainId === 'number' &&
        typeof toChainId === 'number' &&
        fromChainId !== toChainId
      const label = isCrossChain
        ? t('checkout.transactionStatus.steps.bridgedTo', {
            chain: getChainById(toChainId)?.name ?? '',
          }).trim()
        : t('checkout.transactionStatus.steps.swappedTo', {
            symbol: step.toToken?.symbol ?? '',
          })
      out.push({
        key: `step-${i}`,
        label,
        state: phase === 'done' ? 'done' : 'loading',
      })
    })

    return out
  }, [getChainById, getTransactionLink, phase, sending, t])

  const toAddress = status.toAddress
  const toChainId = receiving?.chainId ?? sending?.chainId

  return (
    <Stack spacing={1.25}>
      {rows.map((row) => (
        <ActionRow
          key={row.key}
          startAdornment={<StateIcon state={row.state} />}
          message={row.label}
          endAdornment={
            row.href ? (
              <ExternalLink
                href={row.href}
                target="_blank"
                rel="nofollow noreferrer"
              >
                <OpenInNew sx={{ fontSize: 16 }} />
              </ExternalLink>
            ) : undefined
          }
        />
      ))}
      {toAddress && toChainId ? (
        <SentToWalletRow toAddress={toAddress} toChainId={toChainId} />
      ) : null}
    </Stack>
  )
}

function StateIcon({ state }: { state: RowState }): JSX.Element {
  if (state === 'done') {
    return <IconCircle status="success" size={24} />
  }
  if (state === 'loading') {
    return (
      <Box
        sx={{
          width: 24,
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={18} thickness={4} />
      </Box>
    )
  }
  return (
    <Box
      sx={(theme) => ({
        width: 24,
        height: 24,
        borderRadius: '50%',
        border: `1.5px solid ${theme.vars.palette.grey[300]}`,
      })}
    />
  )
}

export type { StatusStepListProps }
