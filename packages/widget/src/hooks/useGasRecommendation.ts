import { type ChainId, getGasRecommendation } from '@lifi/sdk'
import { useQuery } from '@tanstack/react-query'
import { useSDKClient } from '../providers/SDKClientProvider.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { HiddenUI } from '../types/widget.js'
import { getQueryKey } from '../utils/queries.js'
import { useAvailableChains } from './useAvailableChains.js'

const refetchInterval = 60_000

export const useGasRecommendation = (
  toChainId?: ChainId,
  fromChain?: ChainId,
  fromToken?: string
) => {
  const { chains } = useAvailableChains()
  const { keyPrefix, hiddenUI } = useWidgetConfig()
  const sdkClient = useSDKClient()

  const checkRecommendationLiFuel =
    Boolean(toChainId) &&
    Boolean(fromChain) &&
    Boolean(fromToken) &&
    Boolean(chains?.length)

  const checkRecommendationMaxButton =
    Boolean(toChainId) && !fromChain && !fromToken && Boolean(chains?.length)

  return useQuery({
    queryKey: [
      getQueryKey('gas-recommendation', keyPrefix),
      toChainId,
      fromChain,
      fromToken,
    ],
    queryFn: async ({
      queryKey: [_, toChainId, fromChain, fromToken],
      signal,
    }) => {
      if (!chains?.some((chain) => chain.id === toChainId)) {
        return null
      }
      const gasRecommendation = await getGasRecommendation(
        sdkClient,
        {
          chainId: toChainId as ChainId,
          fromChain: fromChain as ChainId,
          fromToken: fromToken as string,
        },
        { signal }
      )
      return gasRecommendation
    },
    enabled:
      (checkRecommendationLiFuel || checkRecommendationMaxButton) &&
      !hiddenUI?.includes(HiddenUI.GasRefuelMessage),
    refetchInterval,
    staleTime: refetchInterval,
  })
}
