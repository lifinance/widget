'use client'
import { forwardRef, type ReactNode, useMemo } from 'react'
import { AppDefault } from './AppDefault.js'
import type { WidgetDrawer } from './AppDrawer.js'
import { AppDrawer } from './AppDrawer.js'
import { AppProvider } from './AppProvider.js'
import { ShadowRootProvider } from './providers/ShadowRootProvider.js'
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

  let widget: ReactNode
  if (config.variant === 'drawer') {
    widget = (
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
  } else {
    widget = (
      <AppProvider config={config} formRef={props.formRef}>
        <AppDefault />
      </AppProvider>
    )
  }

  return config?.inShadowRoot ? (
    <ShadowRootProvider>{widget}</ShadowRootProvider>
  ) : (
    widget
  )
})
