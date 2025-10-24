import { createClient, type SDKClient } from '@lifi/sdk'
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
} from 'react'
import { version } from '../config/version.js'
import { useWidgetConfig } from './WidgetProvider/WidgetProvider.js'

const SDKClientContext = createContext<SDKClient>({} as SDKClient)

export const useSDKClient = () => useContext(SDKClientContext)

export const SDKClientProvider = ({ children }: PropsWithChildren) => {
  const widgetConfig = useWidgetConfig()

  const client: SDKClient = useMemo(() => {
    return createClient({
      ...widgetConfig.sdkConfig,
      apiKey: widgetConfig.apiKey,
      integrator: widgetConfig.integrator ?? window?.location.hostname,
      routeOptions: {
        fee: widgetConfig.feeConfig?.fee || widgetConfig.fee,
        referrer: widgetConfig.referrer,
        order: widgetConfig.routePriority,
        slippage: widgetConfig.slippage,
        ...widgetConfig.sdkConfig?.routeOptions,
      },
      disableVersionCheck: true,
      widgetVersion: version,
      // debug: true,
    })
  }, [widgetConfig])

  return (
    <SDKClientContext.Provider value={client}>
      {children}
    </SDKClientContext.Provider>
  )
}
