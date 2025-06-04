import { ChainType } from '@lifi/sdk'
import type { Address } from 'viem'
import { useBytecode } from 'wagmi'

export const useIsContractAddress = (
  address?: string,
  chainId?: number,
  chainType?: ChainType
): {
  isContractAddress: boolean
  contractCode?: string
  isLoading: boolean
  isFetched: boolean
} => {
  const {
    data: contractCode,
    isLoading,
    isFetched,
  } = useBytecode({
    address: address as Address,
    chainId: chainId,
    query: {
      refetchInterval: 300_000,
      staleTime: 300_000,
      enabled: chainType === ChainType.EVM && !!chainId && !!address,
    },
  })

  return {
    isContractAddress: !!contractCode,
    contractCode,
    isLoading,
    isFetched,
  }
}
