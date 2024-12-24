import type { WidgetConfig } from '@lifi/widget'
import { useMediaQuery } from '@mui/material'
import isEqual from 'lodash.isequal'
import diff from 'microdiff'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useContext, useEffect, useRef } from 'react'
import { shallow } from 'zustand/shallow'
import { cloneStructuredConfig } from '../../utils/cloneStructuredConfig'
import { patch } from '../../utils/patch'
import { createWidgetConfigStore } from './createWidgetConfigStore'
import { themeItems } from './themes'
import type { WidgetConfigState, WidgetConfigStore } from './types'
import { getConfigOutput } from './utils/getConfigOutput'

export const WidgetConfigContext = createContext<WidgetConfigStore | null>(null)

export interface WidgetConfigProviderProps extends PropsWithChildren {
  defaultWidgetConfig: Partial<WidgetConfig>
}

export const WidgetConfigProvider: FC<WidgetConfigProviderProps> = ({
  children,
  defaultWidgetConfig,
}) => {
  const storeRef = useRef<WidgetConfigStore>(null)
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  if (!storeRef.current) {
    const themes = [
      {
        id: 'default',
        name: 'Default',
        theme: {
          light: defaultWidgetConfig?.theme || {},
          dark: defaultWidgetConfig?.theme || {},
        },
      },
      ...themeItems,
    ]
    storeRef.current = createWidgetConfigStore(
      defaultWidgetConfig,
      themes,
      prefersDarkMode
    )
  }

  useEffect(() => {
    const currentConfig = storeRef.current?.getState().config
    if (currentConfig && !isEqual(currentConfig, defaultWidgetConfig)) {
      storeRef.current?.getState().setDefaultConfig(defaultWidgetConfig)

      const editorConfigDefaults = getConfigOutput(defaultWidgetConfig)
      const editorConfigUpdates = getConfigOutput(currentConfig)
      const differences = diff(editorConfigDefaults, editorConfigUpdates)

      const mergedConfig = patch(
        cloneStructuredConfig<Partial<WidgetConfig>>(defaultWidgetConfig),
        differences
      ) as Partial<WidgetConfig>

      storeRef.current?.getState().setConfig(mergedConfig)

      // handling theme updated from the default config files
      const defaultTheme = defaultWidgetConfig.theme

      const currentDefaultTheme = storeRef.current
        ?.getState()
        .widgetThemeItems.find((themeItem) => themeItem.id === 'default')?.theme

      if (currentDefaultTheme && !isEqual(currentDefaultTheme, defaultTheme)) {
        storeRef.current?.getState().setAvailableThemes([
          {
            id: 'default',
            name: 'Default',
            theme: { light: defaultTheme || {}, dark: defaultTheme || {} },
          },
          ...themeItems,
        ])
      }
    }
  }, [defaultWidgetConfig])

  return (
    <WidgetConfigContext.Provider value={storeRef.current}>
      {children}
    </WidgetConfigContext.Provider>
  )
}

export function useWidgetConfigStore<T>(
  selector: (store: WidgetConfigState) => T,
  equalityFunction = shallow
) {
  const useStore = useContext(WidgetConfigContext)

  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${WidgetConfigProvider.name}>.`
    )
  }

  return useStore(selector, equalityFunction)
}
