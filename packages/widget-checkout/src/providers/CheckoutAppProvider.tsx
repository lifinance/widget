import type { FormRef, WidgetConfig } from '@lifi/widget/shared'
import {
  I18nProvider,
  QueryClientProvider,
  SDKClientProvider,
  SettingsStoreProvider,
  WalletProvider,
  WidgetProvider,
} from '@lifi/widget/shared'
import type { OnRampProvider } from '@lifi/widget-provider/checkout'
import type { JSX, PropsWithChildren } from 'react'
import { useMemo } from 'react'
import { FrozenQuoteStoreProvider } from '../hooks/useFrozenQuote.js'
import {
  CheckoutFlowStoreProvider,
  useCheckoutFlowStore,
} from '../stores/useCheckoutFlowStore.js'
import { FiatCurrencyStoreProvider } from '../stores/useFiatCurrencyStore.js'
import { CheckoutSdkBridge } from './CheckoutSdkBridge.js'
import { OnRampProviderRegistry } from './OnRampProvider/OnRampProvider.js'
import { ThemeProvider } from './ThemeProvider.js'

export interface CheckoutAppProviderProps extends PropsWithChildren {
  widgetConfig: WidgetConfig
  formRef?: FormRef
  onRampProviders: OnRampProvider[]
}

const NON_WALLET_EXCHANGES_ALLOW: readonly string[] = ['intentFactory']

interface CheckoutAppShellProps extends PropsWithChildren {
  widgetConfig: WidgetConfig
  formRef?: FormRef
  onRampProviders: OnRampProvider[]
}

const CheckoutAppShell: React.FC<CheckoutAppShellProps> = ({
  children,
  widgetConfig,
  formRef,
  onRampProviders,
}) => {
  const fundingSource = useCheckoutFlowStore((s) => s.fundingSource)

  // Non-wallet flows force `exchanges.allow=['intentFactory']` so the IF tool surfaces a route.
  // Wallet flow keeps the integrator's original config untouched.
  const effectiveWidgetConfig = useMemo<WidgetConfig>(() => {
    if (!fundingSource || fundingSource === 'wallet') {
      return widgetConfig
    }
    return {
      ...widgetConfig,
      exchanges: {
        ...widgetConfig.exchanges,
        allow: [...NON_WALLET_EXCHANGES_ALLOW],
      },
    }
  }, [widgetConfig, fundingSource])

  return (
    <QueryClientProvider>
      <SettingsStoreProvider config={widgetConfig}>
        <WidgetProvider config={effectiveWidgetConfig}>
          <I18nProvider>
            <ThemeProvider>
              <SDKClientProvider>
                <CheckoutSdkBridge>
                  <WalletProvider providers={widgetConfig.providers ?? []}>
                    <OnRampProviderRegistry
                      widgetConfig={effectiveWidgetConfig}
                      formRef={formRef}
                      providers={onRampProviders}
                    >
                      {children}
                    </OnRampProviderRegistry>
                  </WalletProvider>
                </CheckoutSdkBridge>
              </SDKClientProvider>
            </ThemeProvider>
          </I18nProvider>
        </WidgetProvider>
      </SettingsStoreProvider>
    </QueryClientProvider>
  )
}

export const CheckoutAppProvider: React.FC<CheckoutAppProviderProps> = ({
  children,
  widgetConfig,
  formRef,
  onRampProviders,
}): JSX.Element => (
  <CheckoutFlowStoreProvider>
    <FiatCurrencyStoreProvider>
      <FrozenQuoteStoreProvider>
        <CheckoutAppShell
          widgetConfig={widgetConfig}
          formRef={formRef}
          onRampProviders={onRampProviders}
        >
          {children}
        </CheckoutAppShell>
      </FrozenQuoteStoreProvider>
    </FiatCurrencyStoreProvider>
  </CheckoutFlowStoreProvider>
)
