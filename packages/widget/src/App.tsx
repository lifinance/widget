'use client'
import { forwardRef, useMemo } from 'react'
import { AppDefault } from './AppDefault.js'
import type { WidgetDrawer } from './AppDrawer.js'
import { AppDrawer } from './AppDrawer.js'
import { AppProvider } from './AppProvider.js'
import type { WidgetConfig, WidgetProps } from './types/widget.js'

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
      <AppProvider
        config={config}
        formRef={props.formRef}
        providers={props.providers}
      >
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
    <AppProvider
      config={config}
      formRef={props.formRef}
      providers={props.providers}
    >
      <AppDefault />
    </AppProvider>
  )
})
