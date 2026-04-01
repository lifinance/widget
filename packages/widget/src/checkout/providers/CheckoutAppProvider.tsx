import type { PropsWithChildren } from 'react'
import { I18nProvider } from '../../providers/I18nProvider/I18nProvider.js'
import { QueryClientProvider } from '../../providers/QueryClientProvider.js'
import { SDKClientProvider } from '../../providers/SDKClientProvider.js'
import { WalletProvider } from '../../providers/WalletProvider/WalletProvider.js'
import { WidgetProvider } from '../../providers/WidgetProvider/WidgetProvider.js'
import { SettingsStoreProvider } from '../../stores/settings/SettingsStore.js'
import type { FormRef, WidgetConfig } from '../../types/widget.js'
import { OnRampProvider } from './OnRampProvider/OnRampProvider.js'
import { ThemeProvider } from './ThemeProvider.js'

export interface CheckoutAppProviderProps extends PropsWithChildren {
  widgetConfig: WidgetConfig
  formRef?: FormRef
}

export const CheckoutAppProvider: React.FC<CheckoutAppProviderProps> = ({
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
                  <OnRampProvider widgetConfig={widgetConfig} formRef={formRef}>
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
