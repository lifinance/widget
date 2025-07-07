import { type ToolsResponse, getTools } from '@lifi/sdk'
import { useQuery } from '@tanstack/react-query'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { useSettingsStore } from '../stores/settings/useSettingsStore.js'
import { getConfigItemSets, isItemAllowedForSets } from '../utils/item.js'
import { getQueryKey } from '../utils/queries.js'

export const useTools = () => {
  const { bridges, exchanges, keyPrefix } = useWidgetConfig()
  const { data } = useQuery({
    queryKey: [
      getQueryKey('tools', keyPrefix),
      bridges?.allow,
      bridges?.deny,
      exchanges?.allow,
      exchanges?.deny,
    ],
    queryFn: async (): Promise<ToolsResponse> => {
      const tools = await getTools()
      const bridgesConfigSets = getConfigItemSets(
        bridges,
        (bridges) => new Set(bridges.map(String))
      )
      const exchangesConfigSets = getConfigItemSets(
        exchanges,
        (exchanges) => new Set(exchanges.map(String))
      )
      const result = {
        bridges: tools.bridges.filter((bridge) =>
          isItemAllowedForSets(bridge.key, bridgesConfigSets, String)
        ),
        exchanges: tools.exchanges.filter((exchange) =>
          isItemAllowedForSets(exchange.key, exchangesConfigSets, String)
        ),
      }
      const { initializeTools } = useSettingsStore.getState()
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
