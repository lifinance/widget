import type { JSX, PropsWithChildren } from 'react'
import { useMemo } from 'react'
import { I18nProvider } from '../../providers/I18nProvider/I18nProvider.js'
import { QueryClientProvider } from '../../providers/QueryClientProvider.js'
import { SDKClientProvider } from '../../providers/SDKClientProvider.js'
import { WalletProvider } from '../../providers/WalletProvider/WalletProvider.js'
import { WidgetProvider } from '../../providers/WidgetProvider/WidgetProvider.js'
import { SettingsStoreProvider } from '../../stores/settings/SettingsStore.js'
import type { FormRef, WidgetConfig } from '../../types/widget.js'
import { FrozenQuoteStoreProvider } from '../hooks/useFrozenQuote.js'
import {
  CheckoutFlowStoreProvider,
  useCheckoutFlowStore,
} from '../stores/useCheckoutFlowStore.js'
import { FiatCurrencyStoreProvider } from '../stores/useFiatCurrencyStore.js'
import { OnRampProvider } from './OnRampProvider/OnRampProvider.js'
import { ThemeProvider } from './ThemeProvider.js'

export interface CheckoutAppProviderProps extends PropsWithChildren {
  widgetConfig: WidgetConfig
  formRef?: FormRef
}

const NON_WALLET_EXCHANGES_ALLOW: readonly string[] = ['intentFactory']

interface CheckoutAppShellProps extends PropsWithChildren {
  widgetConfig: WidgetConfig
  formRef?: FormRef
}

const CheckoutAppShell: React.FC<CheckoutAppShellProps> = ({
  children,
  widgetConfig,
  formRef,
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
                <WalletProvider providers={widgetConfig.providers ?? []}>
                  <OnRampProvider
                    widgetConfig={effectiveWidgetConfig}
                    formRef={formRef}
                  >
                    {children}
                  </OnRampProvider>
                </WalletProvider>
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
}): JSX.Element => (
  <CheckoutFlowStoreProvider>
    <FiatCurrencyStoreProvider>
      <FrozenQuoteStoreProvider>
        <CheckoutAppShell widgetConfig={widgetConfig} formRef={formRef}>
          {children}
        </CheckoutAppShell>
      </FrozenQuoteStoreProvider>
    </FiatCurrencyStoreProvider>
  </CheckoutFlowStoreProvider>
)
