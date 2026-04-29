'use client'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import { forwardRef, useMemo } from 'react'
import { CheckoutModal, type CheckoutModalRef } from './CheckoutModal.js'
import { CheckoutRouter } from './CheckoutRouter.js'
import { ErrorBoundary } from './components/ErrorBoundary.js'
import { CheckoutAppProvider } from './providers/CheckoutAppProvider.js'
import { CheckoutProvider } from './providers/CheckoutProvider.js'
import type { CheckoutConfig, CheckoutProps } from './types/config.js'
import { checkoutConfigToWidgetConfig } from './utils/checkoutToWidgetConfig.js'

export type { CheckoutModalRef }

export const LifiWidgetCheckout: ForwardRefExoticComponent<
  CheckoutProps & RefAttributes<CheckoutModalRef>
> = forwardRef<CheckoutModalRef, CheckoutProps>((props, ref) => {
  const config: CheckoutConfig = useMemo(
    () => ({
      integrator: props.integrator ?? 'lifi-widget-checkout',
      onrampSessionApiUrl: props.onrampSessionApiUrl,
      onSuccess: props.onSuccess,
      onError: props.onError,
      config: props.config,
    }),
    [
      props.integrator,
      props.onrampSessionApiUrl,
      props.onSuccess,
      props.onError,
      props.config,
    ]
  )

  const widgetConfig = useMemo(
    () => checkoutConfigToWidgetConfig(config),
    [config]
  )

  return (
    <CheckoutProvider config={config}>
      <CheckoutAppProvider widgetConfig={widgetConfig} formRef={props.formRef}>
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
})

LifiWidgetCheckout.displayName = 'LifiWidgetCheckout'
