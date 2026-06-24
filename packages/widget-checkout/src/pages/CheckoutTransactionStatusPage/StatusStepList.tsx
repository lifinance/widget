import type { ExtendedTransactionInfo, FullStatusData, Route } from '@lifi/sdk'
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

type RowState = 'done' | 'loading' | 'upcoming'

interface StepRow {
  key: string
  label: string
  state: RowState
  href?: string
}

interface Segment {
  fromChainId?: number
  toChainId?: number
  toSymbol?: string
}

interface StatusStepListProps {
  status?: FullStatusData
  /**
   * `watching` = nothing observed yet (rows hollow); `pending` = deposit
   * landed, execution in flight; `done` = terminal.
   */
  phase: 'watching' | 'pending' | 'done'
  frozenRoute?: Route
  recipientAddress?: string | null
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
  frozenRoute,
  recipientAddress,
}: StatusStepListProps): JSX.Element {
  const { t } = useTranslation()
  const { getChainById } = useAvailableChains()
  const { getTransactionLink } = useExplorer()

  const sending = status?.sending as ExtendedTransactionInfo | undefined
  const receiving = status?.receiving as ExtendedTransactionInfo | undefined

  // Prefer the locally-known quote for the step plan and token symbols — the
  // deposit-address poll is too sparse to populate them. Fall back to the
  // status payload (wallet flow, or once full status arrives).
  const fromSymbol =
    frozenRoute?.steps[0]?.action.fromToken.symbol ?? sending?.token?.symbol

  const segments = useMemo<Segment[]>(() => {
    if (frozenRoute) {
      return frozenRoute.steps
        .flatMap((step) => step.includedSteps ?? [])
        .filter((included) => included.tool !== 'feeCollection')
        .map((included) => ({
          fromChainId: included.action.fromChainId,
          toChainId: included.action.toChainId,
          toSymbol: included.action.toToken.symbol,
        }))
    }
    return (sending?.includedSteps ?? [])
      .filter((included) => included.tool !== 'feeCollection')
      .map((included) => ({
        fromChainId: included.fromToken?.chainId,
        toChainId: included.toToken?.chainId,
        toSymbol: included.toToken?.symbol,
      }))
  }, [frozenRoute, sending])

  const rows = useMemo<StepRow[]>(() => {
    const out: StepRow[] = []
    const sendingTxLink = sending?.txHash
      ? getTransactionLink({
          txHash: sending.txHash,
          chain: sending.chainId,
        })
      : undefined
    const sourceConfirmed = Boolean(sending?.txHash)
    // The deposit-address poll only carries the execution/delivery tx on
    // `receiving` (no sending hash) — the sole explorer link for this flow.
    const receivingTxLink =
      phase === 'done'
        ? (receiving?.txLink ??
          (receiving?.txHash
            ? getTransactionLink({
                txHash: receiving.txHash,
                chain: receiving.chainId,
              })
            : undefined))
        : undefined
    const inFlightState: RowState =
      phase === 'watching' ? 'upcoming' : 'loading'

    if (fromSymbol) {
      // Any status from the deposit-address poll means the deposit landed —
      // NOT_FOUND is surfaced as "no status".
      const received =
        phase === 'done' ||
        sourceConfirmed ||
        (phase === 'pending' && Boolean(status))
      const state: RowState = received ? 'done' : inFlightState
      out.push({
        key: 'tokenReceived',
        label: t(`checkout.transactionStatus.steps.receive.${state}`, {
          symbol: fromSymbol,
        }),
        state,
        href:
          sendingTxLink ??
          (segments.length === 0 ? receivingTxLink : undefined),
      })
    }

    segments.forEach((segment, i) => {
      const isCrossChain =
        typeof segment.fromChainId === 'number' &&
        typeof segment.toChainId === 'number' &&
        segment.fromChainId !== segment.toChainId
      const state: RowState = phase === 'done' ? 'done' : inFlightState
      const label = isCrossChain
        ? t(`checkout.transactionStatus.steps.bridge.${state}`, {
            chain: getChainById(segment.toChainId!)?.name ?? '',
          }).trim()
        : t(`checkout.transactionStatus.steps.swap.${state}`, {
            symbol: segment.toSymbol ?? '',
          })
      out.push({
        key: `step-${i}`,
        label,
        state,
        href: i === segments.length - 1 ? receivingTxLink : undefined,
      })
    })

    return out
  }, [
    fromSymbol,
    getChainById,
    getTransactionLink,
    phase,
    receiving,
    segments,
    sending,
    status,
    t,
  ])

  const toAddress = recipientAddress ?? status?.toAddress
  const toChainId =
    frozenRoute?.toChainId ?? receiving?.chainId ?? sending?.chainId

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
      {phase === 'done' && toAddress && toChainId ? (
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
