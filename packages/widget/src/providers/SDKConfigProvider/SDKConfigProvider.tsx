import { createConfig, type SDKConfig } from '@lifi/sdk'
import {
  useBitcoinContext,
  useEthereumContext,
  useSolanaContext,
  useSuiContext,
} from '@lifi/widget-provider'
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
} from 'react'
import { version } from '../../config/version.js'
import { useAvailableChains } from '../../hooks/useAvailableChains.js'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'

const SDKConfigContext = createContext({})

export const useSDKConfig = () => useContext(SDKConfigContext)

export const SDKConfigProvider = ({ children }: PropsWithChildren) => {
  const widgetConfig = useWidgetConfig()
  const { chains } = useAvailableChains()
  const { sdkProvider: evmSDKProvider } = useEthereumContext()
  const { sdkProvider: utxoSDKProvider } = useBitcoinContext()
  const { sdkProvider: svmSDKProvider } = useSolanaContext()
  const { sdkProvider: suiSDKProvider } = useSuiContext()

  const value = useMemo(() => {
    const _config: SDKConfig = {
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
      preloadChains: false,
      providers: [
        evmSDKProvider,
        svmSDKProvider,
        utxoSDKProvider,
        suiSDKProvider,
        ...(widgetConfig.sdkConfig?.providers || []),
      ].filter((provider) => provider !== null),
      chains: chains ?? [],
      // debug: true,
    }
    //return await createConfig(_config)
    return createConfig(_config) // TODO: becomes async in V4
  }, [
    widgetConfig,
    evmSDKProvider,
    svmSDKProvider,
    utxoSDKProvider,
    suiSDKProvider,
    chains,
  ])

  return (
    <SDKConfigContext.Provider value={value}>
      {children}
    </SDKConfigContext.Provider>
  )
}
