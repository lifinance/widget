import type { StatusResponse } from '@lifi/sdk'
import { getStatus } from '@lifi/sdk'
import { useSDKClient } from '@lifi/widget/shared'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import { getDepositAddressStatus } from '../utils/depositAddressStatus.js'
import {
  computeBackoffInterval,
  depositAddressQueryKey,
  simulateQueryKey,
  txHashQueryKey,
} from '../utils/statusPolling.js'
import {
  getSimulatedStatus,
  isTransactionStatusSimulationKind,
} from '../utils/transactionStatusSimulation.js'

export type CheckoutTransactionPhase = 'pending' | 'done' | 'failed'

export interface CheckoutTransactionStatus {
  status: StatusResponse | undefined
  phase: CheckoutTransactionPhase | undefined
  isLoading: boolean
}

export interface UseCheckoutTransactionStatusArgs {
  transactionHash?: string | null
  depositAddress?: string | null
  fromChain?: number | null
  simulate?: string | null
}

export const useCheckoutTransactionStatus = ({
  transactionHash,
  depositAddress,
  fromChain,
  simulate,
}: UseCheckoutTransactionStatusArgs): CheckoutTransactionStatus => {
  const sdkClient = useSDKClient()
  const isSimulated = isTransactionStatusSimulationKind(simulate)
  const canPollByDeposit = !!depositAddress && !!fromChain
  const canPollByHash = !!transactionHash

  // Same key as the QR-page poll when we're polling by deposit address —
  // react-query shares the cache entry so the handoff is instant.
  const queryKey = isSimulated
    ? simulateQueryKey(simulate)
    : canPollByHash
      ? txHashQueryKey(transactionHash)
      : depositAddressQueryKey(depositAddress, fromChain)

  const startMsRef = useRef(Date.now())

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      if (isSimulated) {
        return getSimulatedStatus(simulate!)
      }
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
    enabled: isSimulated || canPollByHash || canPollByDeposit,
    placeholderData: keepPreviousData,
    refetchInterval: (query) => {
      if (isSimulated) {
        return false
      }
      const status = query.state.data?.status
      if (status === 'DONE' || status === 'FAILED' || status === 'INVALID') {
        return false
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

  return { status: resolvedStatus, phase, isLoading }
}
