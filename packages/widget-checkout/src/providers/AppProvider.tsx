import type { FormRef, WidgetConfig } from '@lifi/widget'
import {
  I18nProvider,
  QueryClientProvider,
  SDKClientProvider,
  SettingsStoreProvider,
  WalletProvider,
  WidgetProvider,
} from '@lifi/widget'
import type { PropsWithChildren } from 'react'
import { OnRampProvider } from './OnRampProvider/OnRampProvider.js'
import { ThemeProvider } from './ThemeProvider.js'

export interface AppProviderProps extends PropsWithChildren {
  widgetConfig: WidgetConfig
  formRef?: FormRef
}

export const AppProvider: React.FC<AppProviderProps> = ({
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
