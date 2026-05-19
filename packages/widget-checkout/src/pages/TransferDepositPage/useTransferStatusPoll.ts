import type { StatusResponse } from '@lifi/sdk'
import { useSDKClient } from '@lifi/widget/shared'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import {
  getDepositAddressStatus,
  getReceivingTxHash,
} from '../../utils/depositAddressStatus.js'
import {
  type CheckoutNavigationRoute,
  checkoutNavigationRoutes,
} from '../../utils/navigationRoutes.js'
import {
  computeBackoffInterval,
  depositAddressQueryKey,
} from '../../utils/statusPolling.js'
import { getTransferReceiptSimulation } from '../../utils/transactionStatusSimulation.js'

export interface UseTransferStatusPollArgs {
  depositAddress: string | null
  fromChain: number | null
  routeId: string | null
  enabled: boolean
}

const statusPath =
  `/${checkoutNavigationRoutes.transactionExecution}/${checkoutNavigationRoutes.transactionStatus}` as `/${CheckoutNavigationRoute}/${CheckoutNavigationRoute}`

/**
 * Polls `/v1/status?depositAddress=…&fromChain=…` (CORE-206) while the user
 * is on the QR/transfer page. Backs off from 5 s → 15 s → 30 s as the deposit
 * window stretches (most CEX/transfer deposits take minutes). While funds
 * haven't landed the backend returns `NOT_FOUND`; the first non-`NOT_FOUND`
 * response navigates to the status page. If the response already carries a
 * `receiving.txHash`, we hand the hash to the status page; otherwise we hand
 * the deposit address so the status page can keep polling.
 *
 * The query key matches the status page's deposit-address key so the two
 * pages share a single cache entry across the handoff.
 *
 * Dev-only: when `?simulateTransferReceipt=done|pending|failed` is present,
 * skips polling and navigates to the status page after the configured delay.
 */
export function useTransferStatusPoll({
  depositAddress,
  fromChain,
  routeId,
  enabled,
}: UseTransferStatusPollArgs): void {
  const navigate = useNavigate()
  const sdkClient = useSDKClient()

  const sim = getTransferReceiptSimulation()

  useEffect(() => {
    if (!enabled || !sim) {
      return
    }
    const id = setTimeout(() => {
      navigate({
        to: statusPath,
        search: { simulateTransactionStatus: sim.kind },
      })
    }, sim.delayMs)
    return () => clearTimeout(id)
  }, [enabled, sim, navigate])

  const pollEnabled =
    enabled && !sim && !!depositAddress && !!fromChain && !!routeId

  const startMsRef = useRef(Date.now())

  const { data } = useQuery({
    queryKey: depositAddressQueryKey(depositAddress, fromChain),
    queryFn: ({ signal }) =>
      getDepositAddressStatus({
        sdkClient,
        depositAddress: depositAddress as string,
        fromChain: fromChain as number,
        signal,
      }),
    enabled: pollEnabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status && status !== 'NOT_FOUND') {
        return false
      }
      return computeBackoffInterval(startMsRef.current)
    },
  })

  useEffect(() => {
    if (!pollEnabled || !data) {
      return
    }
    if (data.status === 'NOT_FOUND') {
      return
    }
    const receivingTxHash = getReceivingTxHash(data)
    navigate({
      to: statusPath,
      search: receivingTxHash
        ? { transactionHash: receivingTxHash }
        : {
            depositAddress: depositAddress as string,
            fromChain: fromChain as number,
          },
    })
  }, [pollEnabled, data, depositAddress, fromChain, navigate])
}

export type { StatusResponse }
