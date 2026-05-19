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
import type { DepositErrorKind } from '../DepositErrorPages/DepositErrorPages.js'

/**
 * Terminal substatus → deposit-error page kind. Refund substatuses
 * (REFUND_IN_PROGRESS, REFUNDED) intentionally fall through to the status
 * page — they use the shared refund variants, not the deposit-error pages.
 */
function resolveDepositErrorKind(
  data: StatusResponse
): DepositErrorKind | null {
  if (data.status !== 'FAILED' && data.status !== 'INVALID') {
    return null
  }
  if (data.substatus === 'EXPIRED') {
    return 'address-expired'
  }
  return 'unexpected'
}

export interface UseTransferStatusPollArgs {
  depositAddress: string | null
  fromChain: number | null
  routeId: string | null
  enabled: boolean
}

const statusPath =
  `/${checkoutNavigationRoutes.transactionExecution}/${checkoutNavigationRoutes.transactionStatus}` as `/${CheckoutNavigationRoute}/${CheckoutNavigationRoute}`

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
    const depositErrorKind = resolveDepositErrorKind(data)
    if (depositErrorKind) {
      navigate({
        to: checkoutNavigationRoutes.depositError,
        params: { kind: depositErrorKind },
      })
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
