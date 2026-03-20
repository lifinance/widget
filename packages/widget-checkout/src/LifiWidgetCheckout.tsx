'use client'
import { forwardRef, useMemo } from 'react'
import { CheckoutDrawer, type CheckoutDrawerRef } from './CheckoutDrawer.js'
import { CheckoutRouter } from './CheckoutRouter.js'
import { CheckoutProvider } from './providers/CheckoutProvider.js'
import { ThemeProvider } from './providers/ThemeProvider.js'
import type { CheckoutConfig, CheckoutProps } from './types/checkout.js'

export type { CheckoutDrawerRef }

export const LifiWidgetCheckout = forwardRef<CheckoutDrawerRef, CheckoutProps>(
  (props, ref) => {
    const config: CheckoutConfig = useMemo(() => {
      const mergedConfig = { ...props, ...props.config }
      return {
        integrator: mergedConfig.integrator ?? 'lifi-widget-checkout',
        apiKey: mergedConfig.apiKey,
        appearance: mergedConfig.appearance,
        theme: mergedConfig.theme,
        onSuccess: mergedConfig.onSuccess,
        onError: mergedConfig.onError,
        onClose: mergedConfig.onClose,
        fundingMethods: mergedConfig.fundingMethods,
      }
    }, [props])

    return (
      <CheckoutProvider config={config}>
        <ThemeProvider>
          <CheckoutDrawer
            ref={ref}
            elementRef={props.elementRef}
            open={props.open}
            onClose={props.onClose}
          >
            <CheckoutRouter />
          </CheckoutDrawer>
        </ThemeProvider>
      </CheckoutProvider>
    )
  }
)

LifiWidgetCheckout.displayName = 'LifiWidgetCheckout'
