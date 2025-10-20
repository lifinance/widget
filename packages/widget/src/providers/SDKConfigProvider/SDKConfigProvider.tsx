import { createConfig, type ExtendedChain, type SDKBaseConfig } from '@lifi/sdk'
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
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'

const SDKConfigContext = createContext<SDKBaseConfig>({} as SDKBaseConfig)

export const useSDKConfig = () => useContext<SDKBaseConfig>(SDKConfigContext)

export const SDKConfigProvider = ({
  children,
  chains,
}: PropsWithChildren<{ chains: ExtendedChain[] }>) => {
  const widgetConfig = useWidgetConfig()
  const { sdkProvider: evmSDKProvider } = useEthereumContext()
  const { sdkProvider: utxoSDKProvider } = useBitcoinContext()
  const { sdkProvider: svmSDKProvider } = useSolanaContext()
  const { sdkProvider: suiSDKProvider } = useSuiContext()

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
      providers: [
        evmSDKProvider,
        svmSDKProvider,
        utxoSDKProvider,
        suiSDKProvider,
        ...(widgetConfig.sdkConfig?.providers || []),
      ].filter((provider) => provider !== null),
      chains,
      // debug: true,
    })
  }, [
    widgetConfig,
    evmSDKProvider,
    svmSDKProvider,
    utxoSDKProvider,
    suiSDKProvider,
    chains,
  ])

  return (
    <SDKConfigContext.Provider value={config}>
      {children}
    </SDKConfigContext.Provider>
  )
}
