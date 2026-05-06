import type { StatusResponse } from '@lifi/sdk'
import { getStatus } from '@lifi/sdk'
import { useQuery } from '@tanstack/react-query'
import { useSDKClient } from '../../providers/SDKClientProvider.js'
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

export const useCheckoutTransactionStatus = (
  transactionHash?: string | null,
  simulate?: string | null
): CheckoutTransactionStatus => {
  const sdkClient = useSDKClient()
  const isSimulated = isTransactionStatusSimulationKind(simulate)

  const { data, isLoading } = useQuery({
    queryKey: [
      'checkout-transaction-status',
      transactionHash,
      simulate ?? null,
    ],
    queryFn: async ({ signal }) => {
      if (isSimulated) {
        return getSimulatedStatus(simulate!)
      }
      if (!transactionHash) {
        return undefined
      }
      return getStatus(sdkClient, { txHash: transactionHash }, { signal })
    },
    enabled: isSimulated || Boolean(transactionHash),
    refetchInterval: (query) => {
      if (isSimulated) {
        return false
      }
      const status = query.state.data?.status
      if (status === 'DONE' || status === 'FAILED' || status === 'INVALID') {
        return false
      }
      return 3_000
    },
  })

  const phase: CheckoutTransactionPhase | undefined = data
    ? data.status === 'DONE'
      ? 'done'
      : data.status === 'FAILED' || data.status === 'INVALID'
        ? 'failed'
        : 'pending'
    : undefined

  return { status: data, phase, isLoading }
}
