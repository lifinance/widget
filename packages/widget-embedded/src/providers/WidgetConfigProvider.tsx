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

const DEV_CONFIG: Partial<WidgetConfig> = {
  integrator: 'widget-embedded-dev',
}

const WidgetConfigContext = createContext<Partial<WidgetConfig> | null>(null)

export const useEmbeddedWidgetConfig = () => useContext(WidgetConfigContext)

export const WidgetConfigProvider: FC<PropsWithChildren> = ({ children }) => {
  const [config, setConfig] = useState<Partial<WidgetConfig> | null>(() => {
    const bridge = GuestBridge.getInstance()
    const existing = bridge.config
    if (existing) {
      return existing as unknown as Partial<WidgetConfig>
    }
    return import.meta.env.DEV ? DEV_CONFIG : null
  })

  useEffect(() => {
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
