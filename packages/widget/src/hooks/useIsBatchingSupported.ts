import type { EVMProvider, ExtendedChain } from '@lifi/sdk'
import { ChainType, isBatchingSupported } from '@lifi/sdk'
import { useEthereumContext } from '@lifi/widget-provider'
import { useQuery } from '@tanstack/react-query'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { getQueryKey } from '../utils/queries.js'

export function useIsBatchingSupported(
  chain?: ExtendedChain,
  address?: string
) {
  const { keyPrefix } = useWidgetConfig()
  const { sdkProvider: evmSDKProvider } = useEthereumContext()

  const enabled = Boolean(
    chain && chain.chainType === ChainType.EVM && !!address && evmSDKProvider
  )
  const { data, isLoading } = useQuery({
    queryKey: [
      getQueryKey('isBatchingSupported', keyPrefix),
      chain?.id,
      address,
    ],
    queryFn: () => {
      return isBatchingSupported({
        provider: evmSDKProvider! as EVMProvider,
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
