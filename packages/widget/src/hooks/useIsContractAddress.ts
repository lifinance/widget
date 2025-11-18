import { ChainType } from '@lifi/sdk'
import { useEthereumContext } from '@lifi/widget-provider'
import { useQuery } from '@tanstack/react-query'

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
  const { getBytecode } = useEthereumContext()

  const {
    data: contractCode,
    isLoading,
    isFetched,
  } = useQuery({
    queryKey: ['getBytecode', address, chainId],
    queryFn: async () => {
      const code = await getBytecode?.(chainId!, address!)
      return code ?? null
    },
    refetchInterval: 300_000,
    staleTime: 300_000,
    enabled:
      chainType === ChainType.EVM && !!chainId && !!address && !!getBytecode,
  })

  return {
    isContractAddress: !!contractCode,
    contractCode: contractCode ?? undefined,
    isLoading,
    isFetched,
  }
}
