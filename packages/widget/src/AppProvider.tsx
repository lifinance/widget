import type { PropsWithChildren } from 'react'
import { I18nProvider } from './providers/I18nProvider/I18nProvider.js'
import { QueryClientProvider } from './providers/QueryClientProvider.js'
import { ThemeProvider } from './providers/ThemeProvider/ThemeProvider.js'
import { WalletProvider } from './providers/WalletProvider/WalletProvider.js'
import { WidgetProvider } from './providers/WidgetProvider/WidgetProvider.js'
import { StoreProvider } from './stores/StoreProvider.js'
import { SettingsStoreProvider } from './stores/settings/SettingsStore.js'
import type { WidgetConfigProps } from './types/widget.js'

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
              <WalletProvider providers={config.providers ?? []}>
                <StoreProvider config={config} formRef={formRef}>
                  {children}
                </StoreProvider>
              </WalletProvider>
            </ThemeProvider>
          </I18nProvider>
        </WidgetProvider>
      </SettingsStoreProvider>
    </QueryClientProvider>
  )
}
