import { ChainType, isBatchingSupported } from '@lifi/sdk'
import type { ExtendedChain } from '@lifi/sdk'
import { useQuery } from '@tanstack/react-query'

export function useIsBatchingSupported(
  chain?: ExtendedChain,
  address?: string
) {
  const enabled = Boolean(
    chain && chain.chainType === ChainType.EVM && !!address
  )
  const { data, isLoading } = useQuery({
    queryKey: ['isBatchingSupported', chain?.id, address],
    queryFn: async () => {
      return await Promise.race([
        isBatchingSupported({ chainId: chain!.id }),
        new Promise<boolean>((resolve) => {
          setTimeout(() => resolve(false), 1_000)
        }),
      ])
    },
    enabled,
    staleTime: 3_600_000,
    retry: false,
  })

  return {
    isBatchingSupported: data,
    isBatchingSupportedLoading: enabled && isLoading,
  }
}
