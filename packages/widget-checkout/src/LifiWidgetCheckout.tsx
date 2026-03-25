'use client'
import { forwardRef, useMemo } from 'react'
import { CheckoutModal, type CheckoutModalRef } from './CheckoutModal.js'
import { CheckoutRouter } from './CheckoutRouter.js'
import { ErrorBoundary } from './components/ErrorBoundary.js'
import { AppProvider } from './providers/AppProvider.js'
import { CheckoutProvider } from './providers/CheckoutProvider.js'
import type { CheckoutConfig, CheckoutProps } from './types/checkout.js'
import { checkoutConfigToWidgetConfig } from './utils/checkoutToWidgetConfig.js'

export type { CheckoutModalRef }

export const LifiWidgetCheckout = forwardRef<CheckoutModalRef, CheckoutProps>(
  (props, ref) => {
    const config: CheckoutConfig = useMemo(() => {
      const mergedConfig = { ...props, ...props.config }
      return {
        integrator: mergedConfig.integrator ?? 'lifi-widget-checkout',
        apiKey: mergedConfig.apiKey,
        onrampSessionApiUrl: mergedConfig.onrampSessionApiUrl,
        appearance: mergedConfig.appearance,
        theme: mergedConfig.theme,
        onSuccess: mergedConfig.onSuccess,
        onError: mergedConfig.onError,
        onClose: mergedConfig.onClose,
        fundingMethods: mergedConfig.fundingMethods,
        providers: mergedConfig.providers,
        walletConfig: mergedConfig.walletConfig,
        sdkConfig: mergedConfig.sdkConfig,
        widget: mergedConfig.widget,
      }
    }, [props])

    const widgetConfig = useMemo(
      () => checkoutConfigToWidgetConfig(config),
      [config]
    )

    return (
      <CheckoutProvider config={config}>
        <AppProvider widgetConfig={widgetConfig} formRef={props.formRef}>
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
        </AppProvider>
      </CheckoutProvider>
    )
  }
)

LifiWidgetCheckout.displayName = 'LifiWidgetCheckout'
