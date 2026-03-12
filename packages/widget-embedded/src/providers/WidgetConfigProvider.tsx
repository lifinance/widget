import type { WidgetConfig } from '@lifi/widget'
import type { WidgetLightConfig } from '@lifi/widget-light'
import { GuestBridge } from '@lifi/widget-light'
import {
  createContext,
  type FC,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const isInsideIframe = window.self !== window.top

const DEFAULT_CONFIG: Partial<WidgetConfig> = {
  integrator: 'widget-embedded',
}

const WidgetConfigContext = createContext<Partial<WidgetConfig> | null>(null)

export const useEmbeddedWidgetConfig = () => useContext(WidgetConfigContext)

/**
 * Converts the serializable WidgetLightConfig into a Partial<WidgetConfig>,
 * injecting `walletConfig.onConnect` when the host signals external wallet
 * management via `useExternalWalletManagement`.
 */
function toWidgetConfig(cfg: WidgetLightConfig): Partial<WidgetConfig> {
  const base = cfg as unknown as Partial<WidgetConfig>
  if (!cfg.walletConfig?.useExternalWalletManagement) {
    return base
  }
  const bridge = GuestBridge.getInstance()
  return {
    ...base,
    walletConfig: {
      ...base.walletConfig,
      onConnect(args) {
        bridge.sendConnectWalletRequest(
          args
            ? { chainId: args.chain?.id, chainType: args.chainType }
            : undefined
        )
      },
    },
  }
}

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

  const config = useMemo(
    () => (lightConfig ? toWidgetConfig(lightConfig) : null),
    [lightConfig]
  )

  const value = isInsideIframe ? config : DEFAULT_CONFIG

  return (
    <WidgetConfigContext.Provider value={value}>
      {children}
    </WidgetConfigContext.Provider>
  )
}
