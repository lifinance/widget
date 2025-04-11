import type { Address } from 'viem'
import { isAddress } from 'viem'
import { useTransactionCount } from 'wagmi'
import { useFieldValues } from '../stores/form/useFieldValues.js'

interface AddressActivity {
  hasActivity: boolean
  isLoading: boolean
  isFetched: boolean
  toAddress: string | undefined
}

export const useAddressActivity = (chainId?: number): AddressActivity => {
  const [toAddress, toChainId] = useFieldValues('toAddress', 'toChain')

  const destinationChainId = chainId ?? toChainId

  const {
    data: transactionCount,
    isLoading,
    isFetched,
    error,
  } = useTransactionCount({
    address: toAddress as Address,
    chainId: destinationChainId,
    query: {
      enabled: Boolean(toAddress && destinationChainId && isAddress(toAddress)),
      refetchInterval: 300_000,
      staleTime: 300_000,
    },
  })

  return {
    toAddress,
    hasActivity: Boolean(transactionCount && transactionCount > 0),
    isLoading,
    isFetched: isFetched && !error,
  }
}
