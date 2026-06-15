import type { StatusResponse } from '@lifi/sdk'
import { getStatus } from '@lifi/sdk'
import { useSDKClient } from '@lifi/widget/shared'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { getDepositAddressStatus } from '../utils/depositAddressStatus.js'
import {
  computeBackoffInterval,
  depositAddressQueryKey,
  txHashQueryKey,
} from '../utils/statusPolling.js'

export type CheckoutTransactionPhase = 'pending' | 'done' | 'failed'

export interface CheckoutTransactionStatus {
  status: StatusResponse | undefined
  phase: CheckoutTransactionPhase | undefined
  isLoading: boolean
  notFound: boolean
}

export interface UseCheckoutTransactionStatusArgs {
  transactionHash?: string | null
  depositAddress?: string | null
  fromChain?: number | null
  /**
   * Defers the deposit-address poll, e.g. while an on-ramp provider modal is
   * still open and no funds can have been sent yet. The hash path is never
   * paused — a hash means the deposit already happened.
   */
  pauseDepositPoll?: boolean
}

export const useCheckoutTransactionStatus = ({
  transactionHash,
  depositAddress,
  fromChain,
  pauseDepositPoll,
}: UseCheckoutTransactionStatusArgs): CheckoutTransactionStatus => {
  const sdkClient = useSDKClient()
  // Status is ALWAYS polled by deposit address — the tx hash is a
  // display/details supplement, never a status query. The hash path exists
  // solely for the transaction details page, which has no deposit address.
  const canPollByDeposit = !!depositAddress && !!fromChain && !pauseDepositPoll
  const canPollByHash = !!transactionHash && !canPollByDeposit
  const enabled = canPollByHash || canPollByDeposit

  // Same key as the QR-page poll when we're polling by deposit address —
  // react-query shares the cache entry so the handoff is instant.
  const queryKey = canPollByDeposit
    ? depositAddressQueryKey(depositAddress, fromChain)
    : txHashQueryKey(transactionHash)

  // Lazy so the fast-poll backoff window starts when polling actually begins,
  // not when the page mounts (polling may be paused at mount).
  const startMsRef = useRef<number | null>(null)
  // Re-arm the window when polling stops (e.g. the modal reopens on retry).
  useEffect(() => {
    if (!enabled) {
      startMsRef.current = null
    }
  }, [enabled])

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      if (canPollByHash) {
        return getStatus(sdkClient, { txHash: transactionHash! }, { signal })
      }
      if (canPollByDeposit) {
        return getDepositAddressStatus({
          sdkClient,
          depositAddress: depositAddress!,
          fromChain: fromChain!,
          signal,
        })
      }
      return undefined
    },
    enabled,
    placeholderData: keepPreviousData,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status === 'DONE' || status === 'FAILED' || status === 'INVALID') {
        return false
      }
      if (startMsRef.current == null) {
        startMsRef.current = Date.now()
      }
      return computeBackoffInterval(startMsRef.current)
    },
  })

  // `NOT_FOUND` from the deposit-address path means the deposit hasn't
  // landed yet — surface it as "no status yet" so the caller keeps the
  // watching screen up instead of flipping to executing.
  const resolvedStatus = data && data.status !== 'NOT_FOUND' ? data : undefined

  const phase: CheckoutTransactionPhase | undefined = resolvedStatus
    ? resolvedStatus.status === 'DONE'
      ? 'done'
      : resolvedStatus.status === 'FAILED' ||
          resolvedStatus.status === 'INVALID'
        ? 'failed'
        : 'pending'
    : undefined

  const notFound = data?.status === 'NOT_FOUND'

  return { status: resolvedStatus, phase, isLoading, notFound }
}
