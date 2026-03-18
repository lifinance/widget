import type { WidgetConfig } from '@lifi/widget'
import type { WidgetLightConfig } from '@lifi/widget-light'
import { GuestBridge } from '@lifi/widget-light'
import {
  createContext,
  type FC,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const isInsideIframe = window.self !== window.top

export const EMBEDDED_DEFAULT_CONFIG: Partial<WidgetConfig> = {
  integrator: 'widget-embedded',
}

const WidgetConfigContext = createContext<Partial<WidgetConfig> | null>(null)

export const useEmbeddedWidgetConfig = () => useContext(WidgetConfigContext)

export const WidgetConfigProvider: FC<PropsWithChildren> = ({ children }) => {
  const [lightConfig, setLightConfig] = useState<WidgetLightConfig | null>(
    () => {
      if (isInsideIframe) {
        return GuestBridge.getInstance().config
      }
      return null
    }
  )

  useEffect(() => {
    if (!isInsideIframe) {
      return
    }
    const bridge = GuestBridge.getInstance()
    return bridge.onConfig(setLightConfig)
  }, [])

  // Stable reference so downstream consumers don't re-render on every
  // CONFIG_UPDATE just because the onConnect closure was recreated.
  const onConnect: WidgetConfig['walletConfig'] extends
    | { onConnect?: infer F }
    | undefined
    ? F
    : never = useCallback((args: any) => {
    GuestBridge.getInstance().sendConnectWalletRequest(
      args ? { chainId: args.chain?.id, chainType: args.chainType } : undefined
    )
  }, [])

  const config = useMemo(() => {
    if (!lightConfig) {
      return null
    }
    const base = lightConfig as unknown as Partial<WidgetConfig>
    if (!lightConfig.walletConfig?.useExternalWalletManagement) {
      return base
    }
    return {
      ...base,
      walletConfig: {
        ...base.walletConfig,
        onConnect,
      },
    }
  }, [lightConfig, onConnect])

  const value = isInsideIframe ? config : EMBEDDED_DEFAULT_CONFIG

  return (
    <WidgetConfigContext.Provider value={value}>
      {children}
    </WidgetConfigContext.Provider>
  )
}
