import {
  createConfig,
  type ExtendedChain,
  type SDKBaseConfig,
  type SDKConfig,
} from '@lifi/sdk'
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
  useEffect,
  useMemo,
  useState,
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

  const _config: SDKConfig = useMemo(() => {
    return {
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
      chains,
      // debug: true,
    }
  }, [
    widgetConfig,
    evmSDKProvider,
    svmSDKProvider,
    utxoSDKProvider,
    suiSDKProvider,
    chains,
  ])

  // TODO: if there is no chainPreloading, config should be sync
  // Remove useEffect once function signatures change
  const [value, setValue] = useState<SDKConfig | SDKBaseConfig>(_config)
  useEffect(() => {
    async function init() {
      const fullConfig = await createConfig(_config)
      setValue(fullConfig)
    }
    init()
  }, [_config])

  return (
    <SDKConfigContext.Provider value={value as SDKBaseConfig}>
      {children}
    </SDKConfigContext.Provider>
  )
}
