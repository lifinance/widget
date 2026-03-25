import type { FormRef, WidgetConfig } from '@lifi/widget'
import {
  I18nProvider,
  QueryClientProvider,
  SDKClientProvider,
  SettingsStoreProvider,
  StoreProvider,
  WalletProvider,
  WidgetProvider,
} from '@lifi/widget'
import type { PropsWithChildren } from 'react'
import { ThemeProvider } from './ThemeProvider.js'
import { TransakProvider } from './TransakProvider.js'

export interface CheckoutWidgetRuntimeProps extends PropsWithChildren {
  widgetConfig: WidgetConfig
  formRef?: FormRef
}

export const CheckoutWidgetRuntime: React.FC<CheckoutWidgetRuntimeProps> = ({
  children,
  widgetConfig,
  formRef,
}) => {
  return (
    <QueryClientProvider>
      <SettingsStoreProvider config={widgetConfig}>
        <WidgetProvider config={widgetConfig}>
          <I18nProvider>
            <ThemeProvider>
              <SDKClientProvider>
                <WalletProvider providers={widgetConfig.providers ?? []}>
                  <TransakProvider widgetConfig={widgetConfig}>
                    <StoreProvider config={widgetConfig} formRef={formRef}>
                      {children}
                    </StoreProvider>
                  </TransakProvider>
                </WalletProvider>
              </SDKClientProvider>
            </ThemeProvider>
          </I18nProvider>
        </WidgetProvider>
      </SettingsStoreProvider>
    </QueryClientProvider>
  )
}
