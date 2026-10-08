import type { ToolsResponse } from '@lifi/sdk'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { useSDKClient } from '../providers/SDKClientProvider.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { getToolsQueryOptions } from '../queries/getTools.js'
import { useSettingsStoreContext } from '../stores/settings/SettingsStore.js'
import { getConfigItemSets, isItemAllowedForSets } from '../utils/item.js'

const refetchInterval = 180_000

export const useTools = (): { tools: ToolsResponse | undefined } => {
  const { bridges, exchanges, queryScopeKey } = useWidgetConfig()
  const settingsStore = useSettingsStoreContext()
  const sdkClient = useSDKClient()

  const selectAllowedTools = useCallback(
    (tools: ToolsResponse): ToolsResponse => {
      const bridgeSets = getConfigItemSets(bridges, (keys) => new Set(keys))
      const exchangeSets = getConfigItemSets(exchanges, (keys) => new Set(keys))
      return {
        bridges: tools.bridges.filter((bridge) =>
          isItemAllowedForSets(bridge.key, bridgeSets)
        ),
        exchanges: tools.exchanges.filter((exchange) =>
          isItemAllowedForSets(exchange.key, exchangeSets)
        ),
      }
    },
    [bridges, exchanges]
  )

  const { data } = useQuery(
    getToolsQueryOptions(sdkClient, {
      scopeKey: queryScopeKey,
      query: {
        refetchInterval,
        staleTime: refetchInterval,
        select: selectAllowedTools,
      },
    })
  )

  // A host may fill the shared entry, so seed from the data, not in a queryFn.
  useEffect(() => {
    if (!data) {
      return
    }
    const { initializeTools } = settingsStore.getState()
    initializeTools(
      'Bridges',
      data.bridges.map((bridge) => bridge.key)
    )
    initializeTools(
      'Exchanges',
      data.exchanges.map((exchange) => exchange.key)
    )
  }, [data, settingsStore])

  return { tools: data }
}
