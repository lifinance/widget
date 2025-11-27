'use client'
import { forwardRef, useMemo } from 'react'
import { AppDefault } from './AppDefault'
import type { WidgetDrawer } from './AppDrawer'
import { AppDrawer } from './AppDrawer'
import { AppProvider } from './AppProvider'
import type { WidgetConfig, WidgetProps } from './types/widget'

export const App = forwardRef<WidgetDrawer, WidgetProps>((props, ref) => {
  const config: WidgetConfig = useMemo(() => {
    const config = { ...props, ...props.config }
    if (config.variant === 'drawer') {
      config.theme = {
        ...config.theme,
        container: {
          height: '100%',
          ...config.theme?.container,
        },
      }
    }
    return config
  }, [props])

  if (config.variant === 'drawer') {
    return (
      <AppProvider config={config} formRef={props.formRef}>
        <AppDrawer
          ref={ref}
          elementRef={props.elementRef}
          config={config}
          open={props.open}
          onClose={props.onClose}
        >
          <AppDefault />
        </AppDrawer>
      </AppProvider>
    )
  }

  return (
    <AppProvider config={config} formRef={props.formRef}>
      <AppDefault />
    </AppProvider>
  )
})
