import type { StatusResponse } from '@lifi/sdk'
import { getStatus } from '@lifi/sdk'
import { useSDKClient } from '@lifi/widget/shared'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { getDepositAddressStatus } from '../utils/depositAddressStatus.js'
import type { HashStatusHints } from '../utils/statusHints.js'
import {
  computeBackoffInterval,
  depositAddressQueryKey,
  taskIdQueryKey,
  txHashQueryKey,
} from '../utils/statusPolling.js'

export type CheckoutTransactionPhase = 'pending' | 'done' | 'failed'

export interface CheckoutTransactionStatus {
  status: StatusResponse | undefined
  phase: CheckoutTransactionPhase | undefined
  isLoading: boolean
  notFound: boolean
  isError: boolean
  refetch: () => void
}

export interface UseCheckoutTransactionStatusArgs {
  transactionHash?: string | null
  /** Relayer/gasless task id; distinct from transactionHash in the status API. */
  taskId?: string | null
  depositAddress?: string | null
  fromChain?: number | null
  /**
   * Defers the deposit-address poll, e.g. while an on-ramp provider modal is
   * still open and no funds can have been sent yet. The hash path is never
   * paused — a hash means the deposit already happened.
   */
  pauseDepositPoll?: boolean
  /**
   * Cross-chain hints (bridge/toChain) forwarded to the hash poll. The SDK needs
   * `bridge` to resolve a cross-chain transfer by tx hash; ignored on the
   * deposit-address path.
   */
  statusHints?: HashStatusHints
}

export const useCheckoutTransactionStatus = ({
  transactionHash,
  taskId,
  depositAddress,
  fromChain,
  pauseDepositPoll,
  statusHints,
}: UseCheckoutTransactionStatusArgs): CheckoutTransactionStatus => {
  const sdkClient = useSDKClient()
  // Deposit-funded flows poll by deposit address (hash/taskId are display-only
  // there). A non-IF wallet payment has no deposit address, so it polls by hash,
  // or by taskId for a relayer route — distinct keys in the SDK status API.
  const canPollByDeposit = !!depositAddress && !!fromChain && !pauseDepositPoll
  const canPollByHash = !!transactionHash && !canPollByDeposit
  const canPollByTaskId = !!taskId && !canPollByDeposit && !canPollByHash
  const enabled = canPollByDeposit || canPollByHash || canPollByTaskId

  // Same key as the QR-page poll when we're polling by deposit address —
  // react-query shares the cache entry so the handoff is instant.
  const queryKey = canPollByDeposit
    ? depositAddressQueryKey(depositAddress, fromChain)
    : canPollByHash
      ? txHashQueryKey(transactionHash)
      : taskIdQueryKey(taskId)

  // Lazy so the fast-poll backoff window starts when polling actually begins,
  // not when the page mounts (polling may be paused at mount).
  const startMsRef = useRef<number | null>(null)
  // Re-arm the window when polling stops (e.g. the modal reopens on retry).
  useEffect(() => {
    if (!enabled) {
      startMsRef.current = null
    }
  }, [enabled])

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      if (canPollByDeposit) {
        return getDepositAddressStatus({
          sdkClient,
          depositAddress: depositAddress!,
          fromChain: fromChain!,
          signal,
        })
      }
      if (canPollByHash) {
        return getStatus(
          sdkClient,
          { txHash: transactionHash!, ...statusHints },
          { signal }
        )
      }
      if (canPollByTaskId) {
        return getStatus(
          sdkClient,
          { taskId: taskId!, ...statusHints },
          { signal }
        )
      }
      return undefined
    },
    enabled,
    placeholderData: keepPreviousData,
    refetchInterval: (query) => {
      if (query.state.status === 'error') {
        return false
      }
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

  // IF status can regress to NOT_FOUND post-real; latch so it can't downgrade.
  const latchedRef = useRef<{ key: string; status: StatusResponse } | null>(
    null
  )
  const latchKey = queryKey.join('|')
  if (latchedRef.current && latchedRef.current.key !== latchKey) {
    latchedRef.current = null
  }

  let resolvedStatus: StatusResponse | undefined
  if (data && data.status !== 'NOT_FOUND') {
    resolvedStatus = data
    if (canPollByDeposit) {
      latchedRef.current = { key: latchKey, status: data }
    }
  } else if (canPollByDeposit && latchedRef.current) {
    resolvedStatus = latchedRef.current.status
  } else {
    resolvedStatus = undefined
  }

  const phase: CheckoutTransactionPhase | undefined = resolvedStatus
    ? resolvedStatus.status === 'DONE'
      ? 'done'
      : resolvedStatus.status === 'FAILED' ||
          resolvedStatus.status === 'INVALID'
        ? 'failed'
        : 'pending'
    : undefined

  const notFound = data?.status === 'NOT_FOUND'

  return {
    status: resolvedStatus,
    phase,
    isLoading,
    notFound,
    isError,
    refetch,
  }
}
