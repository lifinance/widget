import type { ExtendedChain } from '@lifi/sdk'
import { ChainType, isBatchingSupported } from '@lifi/sdk'
import { useQuery } from '@tanstack/react-query'
import { useSDKClient } from '../providers/SDKClientProvider.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { getQueryKey } from '../utils/queries.js'

export function useIsBatchingSupported(
  chain?: ExtendedChain,
  address?: string
) {
  const { keyPrefix } = useWidgetConfig()
  const sdkClient = useSDKClient()

  const enabled = Boolean(
    chain && chain.chainType === ChainType.EVM && !!address
  )
  const { data, isLoading } = useQuery({
    queryKey: [
      getQueryKey('isBatchingSupported', keyPrefix),
      chain?.id,
      address,
    ],
    queryFn: () => {
      return isBatchingSupported(sdkClient, {
        chainId: chain!.id,
        skipReady: true,
      })
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
