import { createConfig, type SDKBaseConfig } from '@lifi/sdk'
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
} from 'react'
import { version } from '../../config/version.js'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'

const SDKConfigContext = createContext<SDKBaseConfig>({} as SDKBaseConfig)

export const useSDKConfig = () => useContext<SDKBaseConfig>(SDKConfigContext)

export const SDKConfigProvider = ({ children }: PropsWithChildren) => {
  const widgetConfig = useWidgetConfig()

  const config: SDKBaseConfig = useMemo(() => {
    return createConfig({
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
    <SDKConfigContext.Provider value={config}>
      {children}
    </SDKConfigContext.Provider>
  )
}
