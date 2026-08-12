import type { StatusResponse } from '@lifi/sdk'
import { getStatus } from '@lifi/sdk'
import { useSDKClient } from '@lifi/widget/shared'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import {
  computeBackoffInterval,
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
}

/**
 * Polls the on-chain status of a source transaction hash — the wallet flow's
 * post-execution "see details" view and the order-driven status page's
 * terminal-state details link. Deposit-address/task-id polling was retired
 * with the legacy status-bypass layer (Task 11); the funding-order status
 * page (Task 9) is the only status source for in-flight deposits now.
 */
export const useCheckoutTransactionStatus = ({
  transactionHash,
}: UseCheckoutTransactionStatusArgs): CheckoutTransactionStatus => {
  const sdkClient = useSDKClient()
  const enabled = !!transactionHash
  const queryKey = txHashQueryKey(transactionHash)

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
    queryFn: ({ signal }) =>
      transactionHash
        ? getStatus(sdkClient, { txHash: transactionHash }, { signal })
        : Promise.resolve(undefined),
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

  return {
    status: resolvedStatus,
    phase,
    isLoading,
    notFound,
    isError,
    refetch,
  }
}
