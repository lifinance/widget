import type { WidgetConfig } from '@lifi/widget'
import { GuestBridge } from '@lifi/widget-light'
import {
  createContext,
  type FC,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'

const isInsideIframe = window.self !== window.top

const DEFAULT_CONFIG: Partial<WidgetConfig> = {
  integrator: 'widget-embedded',
}

const WidgetConfigContext = createContext<Partial<WidgetConfig> | null>(null)

export const useEmbeddedWidgetConfig = () => useContext(WidgetConfigContext)

export const WidgetConfigProvider: FC<PropsWithChildren> = ({ children }) => {
  const [config, setConfig] = useState<Partial<WidgetConfig> | null>(() => {
    if (isInsideIframe) {
      const bridge = GuestBridge.getInstance()
      const existing = bridge.config
      if (existing) {
        return existing as unknown as Partial<WidgetConfig>
      }
      return null
    }
    return DEFAULT_CONFIG
  })

  useEffect(() => {
    if (!isInsideIframe) {
      return
    }
    const bridge = GuestBridge.getInstance()
    return bridge.onConfig((cfg) => {
      setConfig(cfg as unknown as Partial<WidgetConfig>)
    })
  }, [])

  return (
    <WidgetConfigContext.Provider value={config}>
      {children}
    </WidgetConfigContext.Provider>
  )
}
