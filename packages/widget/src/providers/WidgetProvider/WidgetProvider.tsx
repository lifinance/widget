import { createContext, useContext, useId, useMemo } from 'react'
import { useSettingsActions } from '../../stores/settings/useSettingsActions.js'
import type { WidgetContextProps, WidgetProviderProps } from './types.js'

const initialContext: WidgetContextProps = {
  elementId: '',
  integrator: '',
}

const WidgetContext = createContext<WidgetContextProps>(initialContext)

export const useWidgetConfig = (): WidgetContextProps =>
  useContext(WidgetContext)

export const WidgetProvider: React.FC<
  React.PropsWithChildren<WidgetProviderProps>
> = ({ children, config: widgetConfig }) => {
  const elementId = useId()
  const { setDefaultSettings } = useSettingsActions()

  if (!widgetConfig?.integrator) {
    throw new Error('Required property "integrator" is missing.')
  }

  const value = useMemo((): WidgetContextProps => {
    try {
      // Create widget configuration object
      const value = {
        ...widgetConfig,
        elementId,
      } as WidgetContextProps

      // Set default settings for widget settings store
      setDefaultSettings(value)

      return value
    } catch (e) {
      console.warn(e)
      return {
        ...widgetConfig,
        elementId,
        integrator: widgetConfig.integrator,
      }
    }
  }, [elementId, widgetConfig, setDefaultSettings])
  return (
    <WidgetContext.Provider value={value}>{children}</WidgetContext.Provider>
  )
}
