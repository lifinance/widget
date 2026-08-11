import type { FormRef, WidgetConfig } from '@lifi/widget/shared'
import {
  BookmarkStoreProvider,
  I18nProvider,
  QueryClientProvider,
  SDKClientProvider,
  SettingsStoreProvider,
  WalletProvider,
  WidgetProvider,
} from '@lifi/widget/shared'
import type { OnRampProvider } from '@lifi/widget-provider/checkout'
import type { JSX, PropsWithChildren } from 'react'
import { FrozenQuoteStoreProvider } from '../hooks/useFrozenQuote.js'
import { CheckoutFlowStoreProvider } from '../stores/useCheckoutFlowStore.js'
import { FiatCurrencyStoreProvider } from '../stores/useFiatCurrencyStore.js'
import { CheckoutSdkBridge } from './CheckoutSdkBridge.js'
import { OnRampProviderRegistry } from './OnRampProvider/OnRampProvider.js'
import { PendingCheckoutPersistenceBridge } from './PendingCheckoutPersistenceBridge.js'
import { ThemeProvider } from './ThemeProvider.js'

export interface CheckoutAppProviderProps extends PropsWithChildren {
  widgetConfig: WidgetConfig
  formRef?: FormRef
  onRampProviders: OnRampProvider[]
}

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
  return (
    <QueryClientProvider>
      <SettingsStoreProvider config={widgetConfig}>
        <WidgetProvider config={widgetConfig}>
          <I18nProvider>
            <ThemeProvider>
              <SDKClientProvider>
                <CheckoutSdkBridge>
                  <WalletProvider providers={widgetConfig.providers ?? []}>
                    <BookmarkStoreProvider namePrefix={widgetConfig.keyPrefix}>
                      <PendingCheckoutPersistenceBridge>
                        <OnRampProviderRegistry
                          widgetConfig={widgetConfig}
                          formRef={formRef}
                          providers={onRampProviders}
                        >
                          {children}
                        </OnRampProviderRegistry>
                      </PendingCheckoutPersistenceBridge>
                    </BookmarkStoreProvider>
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
