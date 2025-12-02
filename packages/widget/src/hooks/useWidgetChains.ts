import { type ChainType, createClient } from '@lifi/sdk'
import type { WidgetConfig } from '../types/widget.js'
import { useAvailableChains } from './useAvailableChains.js'

export const useWidgetChains = (
  widgetConfig?: WidgetConfig,
  chainTypes?: ChainType[]
) => {
  const externalClient = widgetConfig
    ? createClient({
        ...widgetConfig.sdkConfig,
        apiKey: widgetConfig.apiKey,
        integrator: widgetConfig.integrator ?? window?.location.hostname,
      })
    : undefined
  return useAvailableChains(chainTypes, externalClient)
}
