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
import { CheckoutFlowStoreProvider } from '../stores/useCheckoutFlowStore.js'
import { FiatCurrencyStoreProvider } from '../stores/useFiatCurrencyStore.js'
import { OnRampProviderRegistry } from './OnRampProvider/OnRampProvider.js'
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
                <WalletProvider providers={widgetConfig.providers ?? []}>
                  <BookmarkStoreProvider namePrefix={widgetConfig.keyPrefix}>
                    <OnRampProviderRegistry
                      widgetConfig={widgetConfig}
                      formRef={formRef}
                      providers={onRampProviders}
                    >
                      {children}
                    </OnRampProviderRegistry>
                  </BookmarkStoreProvider>
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
  onRampProviders,
}): JSX.Element => (
  <CheckoutFlowStoreProvider>
    <FiatCurrencyStoreProvider>
      <CheckoutAppShell
        widgetConfig={widgetConfig}
        formRef={formRef}
        onRampProviders={onRampProviders}
      >
        {children}
      </CheckoutAppShell>
    </FiatCurrencyStoreProvider>
  </CheckoutFlowStoreProvider>
)
