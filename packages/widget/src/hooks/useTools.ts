import { getTools, type ToolsResponse } from '@lifi/sdk'
import { useQuery } from '@tanstack/react-query'
import { useSDKClient } from '../providers/SDKClientProvider'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider'
import { useSettingsStoreContext } from '../stores/settings/SettingsStore'
import { getConfigItemSets, isItemAllowedForSets } from '../utils/item'
import { getQueryKey } from '../utils/queries'

export const useTools = () => {
  const { bridges, exchanges, keyPrefix } = useWidgetConfig()
  const settingsStore = useSettingsStoreContext()
  const sdkClient = useSDKClient()

  const { data } = useQuery({
    queryKey: [
      getQueryKey('tools', keyPrefix),
      bridges?.allow,
      bridges?.deny,
      exchanges?.allow,
      exchanges?.deny,
    ],
    queryFn: async (): Promise<ToolsResponse> => {
      const tools = await getTools(sdkClient)
      const bridgesConfigSets = getConfigItemSets(
        bridges,
        (bridges) => new Set(bridges)
      )
      const exchangesConfigSets = getConfigItemSets(
        exchanges,
        (exchanges) => new Set(exchanges)
      )
      const result = {
        bridges: tools.bridges.filter((bridge) =>
          isItemAllowedForSets(bridge.key, bridgesConfigSets)
        ),
        exchanges: tools.exchanges.filter((exchange) =>
          isItemAllowedForSets(exchange.key, exchangesConfigSets)
        ),
      }
      const { initializeTools } = settingsStore.getState()
      initializeTools(
        'Bridges',
        result.bridges.map((bridge) => bridge.key)
      )
      initializeTools(
        'Exchanges',
        result.exchanges.map((exchange) => exchange.key)
      )
      return result
    },
    refetchInterval: 180_000,
    staleTime: 180_000,
  })

  return { tools: data }
}
