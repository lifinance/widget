import type { WidgetConfig } from '@lifi/widget'
import { WIDGET_LIGHT_SOURCE } from '@lifi/widget-light'
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
  const [config, setConfig] = useState<Partial<WidgetConfig> | null>(
    import.meta.env.DEV ? DEV_CONFIG : null
  )

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data
      if (!msg || msg.source !== WIDGET_LIGHT_SOURCE) {
        return
      }
      if (msg.type === 'INIT' && msg.config) {
        setConfig(msg.config as unknown as Partial<WidgetConfig>)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <WidgetConfigContext.Provider value={config}>
      {children}
    </WidgetConfigContext.Provider>
  )
}
