'use client'
import { forwardRef, useMemo } from 'react'
import { CheckoutDrawer, type CheckoutDrawerRef } from './CheckoutDrawer.js'
import { CheckoutRouter } from './CheckoutRouter.js'
import { CheckoutProvider } from './providers/CheckoutProvider.js'
import { CheckoutWidgetContainer } from './providers/CheckoutWidgetContainer.js'
import type { CheckoutConfig, CheckoutProps } from './types/checkout.js'
import { checkoutConfigToWidgetConfig } from './utils/checkoutToWidgetConfig.js'

export type { CheckoutDrawerRef }

export const LifiWidgetCheckout = forwardRef<CheckoutDrawerRef, CheckoutProps>(
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
        <CheckoutWidgetContainer
          widgetConfig={widgetConfig}
          formRef={props.formRef}
        >
          <CheckoutDrawer
            ref={ref}
            elementRef={props.elementRef}
            open={props.open}
            onClose={props.onClose}
          >
            <CheckoutRouter />
          </CheckoutDrawer>
        </CheckoutWidgetContainer>
      </CheckoutProvider>
    )
  }
)

LifiWidgetCheckout.displayName = 'LifiWidgetCheckout'
