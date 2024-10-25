import { ChainType } from '@lifi/sdk'
import type { Address } from 'viem'
import { useBytecode } from 'wagmi'

export const useIsContractAddress = (
  address?: string,
  chainId?: number,
  chainType?: ChainType
) => {
  const { data: contractCode } = useBytecode({
    address: address as Address,
    chainId: chainId,
    query: {
      refetchInterval: 300_000,
      staleTime: 300_000,
      enabled: Boolean(chainType === ChainType.EVM && chainId),
    },
  })
  const isContractAddress = !!contractCode
  return isContractAddress
}
