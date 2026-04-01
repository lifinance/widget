'use client'
import { forwardRef, useMemo } from 'react'
import { CheckoutModal, type CheckoutModalRef } from './CheckoutModal.js'
import { CheckoutRouter } from './CheckoutRouter.js'
import { ErrorBoundary } from './components/ErrorBoundary.js'
import { CheckoutAppProvider } from './providers/CheckoutAppProvider.js'
import { CheckoutProvider } from './providers/CheckoutProvider.js'
import type { CheckoutConfig, CheckoutProps } from './types/config.js'
import { checkoutConfigToWidgetConfig } from './utils/checkoutToWidgetConfig.js'

export type { CheckoutModalRef }

export const LifiWidgetCheckout = forwardRef<CheckoutModalRef, CheckoutProps>(
  (props, ref) => {
    const config: CheckoutConfig = useMemo(
      () =>
        ({
          ...props,
          integrator: props.integrator ?? 'lifi-widget-checkout',
        }) as CheckoutConfig,
      [props]
    )

    const widgetConfig = useMemo(
      () => checkoutConfigToWidgetConfig(config),
      [config]
    )

    return (
      <CheckoutProvider config={config}>
        <CheckoutAppProvider
          widgetConfig={widgetConfig}
          formRef={props.formRef}
        >
          <CheckoutModal
            ref={ref}
            elementRef={props.elementRef}
            open={props.open}
            onClose={props.onClose}
          >
            <ErrorBoundary>
              <CheckoutRouter />
            </ErrorBoundary>
          </CheckoutModal>
        </CheckoutAppProvider>
      </CheckoutProvider>
    )
  }
)

LifiWidgetCheckout.displayName = 'LifiWidgetCheckout'
