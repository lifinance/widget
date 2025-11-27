import type { PropsWithChildren } from 'react'
import { I18nProvider } from './providers/I18nProvider/I18nProvider'
import { QueryClientProvider } from './providers/QueryClientProvider'
import { SDKClientProvider } from './providers/SDKClientProvider'
import { ThemeProvider } from './providers/ThemeProvider/ThemeProvider'
import { WalletProvider } from './providers/WalletProvider/WalletProvider'
import { WidgetProvider } from './providers/WidgetProvider/WidgetProvider'
import { StoreProvider } from './stores/StoreProvider'
import { SettingsStoreProvider } from './stores/settings/SettingsStore'
import type { WidgetConfigProps } from './types/widget'

export const AppProvider: React.FC<PropsWithChildren<WidgetConfigProps>> = ({
  children,
  config,
  formRef,
}) => {
  if (!config.providers?.length && process.env.NODE_ENV === 'development') {
    console.warn('No widget providers specified')
  }
  return (
    <QueryClientProvider>
      <SettingsStoreProvider config={config}>
        <WidgetProvider config={config}>
          <I18nProvider>
            <ThemeProvider>
              <SDKClientProvider>
                <WalletProvider providers={config.providers ?? []}>
                  <StoreProvider config={config} formRef={formRef}>
                    {children}
                  </StoreProvider>
                </WalletProvider>
              </SDKClientProvider>
            </ThemeProvider>
          </I18nProvider>
        </WidgetProvider>
      </SettingsStoreProvider>
    </QueryClientProvider>
  )
}
