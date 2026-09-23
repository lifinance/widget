import type { Context } from 'react'
import { createContext, use, useId, useMemo } from 'react'
import { useSettingsActions } from '../../stores/settings/useSettingsActions.js'
import { withDestinationOnlyChains } from '../../utils/chainType.js'
import type { WidgetContextProps, WidgetProviderProps } from './types.js'

const initialContext: WidgetContextProps = {
  elementId: '',
  integrator: '',
}

export const WidgetContext: Context<WidgetContextProps> =
  createContext<WidgetContextProps>(initialContext)

export const useWidgetConfig = (): WidgetContextProps => use(WidgetContext)

export const WidgetProvider: React.FC<
  React.PropsWithChildren<WidgetProviderProps>
> = ({ children, config: widgetConfig }) => {
  const elementId = useId()
  const { setDefaultSettings } = useSettingsActions()

  if (!widgetConfig?.integrator) {
    throw new Error('Required property "integrator" is missing.')
  }

  // Keyed on the integrator's `chains`: the config object is new on every render.
  const chains = useMemo(
    () => withDestinationOnlyChains(widgetConfig.chains),
    [widgetConfig.chains]
  )

  const value = useMemo((): WidgetContextProps => {
    const value = {
      ...widgetConfig,
      chains,
      elementId,
    } as WidgetContextProps
    try {
      // Set default settings for widget settings store
      setDefaultSettings(value)
    } catch (e) {
      console.warn(e)
    }
    return value
  }, [elementId, widgetConfig, chains, setDefaultSettings])
  return <WidgetContext value={value}>{children}</WidgetContext>
}
