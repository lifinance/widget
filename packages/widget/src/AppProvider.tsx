import type { PropsWithChildren } from 'react'
import { Fragment } from 'react'
import {
  MemoryRouter,
  type MemoryRouterProps,
  useInRouterContext,
} from 'react-router-dom'
import { PageEntered } from './components/PageEntered.js'
import { I18nProvider } from './providers/I18nProvider/I18nProvider.js'
import { QueryClientProvider } from './providers/QueryClientProvider.js'
import { SDKClientProvider } from './providers/SDKClientProvider.js'
import { ThemeProvider } from './providers/ThemeProvider/ThemeProvider.js'
import { WalletProvider } from './providers/WalletProvider/WalletProvider.js'
import {
  useWidgetConfig,
  WidgetProvider,
} from './providers/WidgetProvider/WidgetProvider.js'
import { URLSearchParamsBuilder } from './stores/form/URLSearchParamsBuilder.js'
import { StoreProvider } from './stores/StoreProvider.js'
import { SettingsStoreProvider } from './stores/settings/SettingsStore.js'
import type {
  WidgetConfigProps,
  WidgetWalletProvidersProps,
} from './types/widget.js'

export const AppProvider: React.FC<
  PropsWithChildren<WidgetConfigProps & WidgetWalletProvidersProps>
> = ({ children, config, formRef, providers }) => {
  if (!providers?.length && process.env.NODE_ENV === 'development') {
    console.warn('No widget providers specified')
  }
  return (
    <QueryClientProvider>
      <SettingsStoreProvider config={config}>
        <WidgetProvider config={config}>
          <I18nProvider>
            <ThemeProvider>
              <SDKClientProvider>
                <WalletProvider providers={providers}>
                  <StoreProvider config={config} formRef={formRef}>
                    <AppRouter>{children}</AppRouter>
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

const memoryRouterProps: MemoryRouterProps = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
}

const AppRouter: React.FC<PropsWithChildren> = ({ children }) => {
  const { buildUrl } = useWidgetConfig()
  const inRouterContext = useInRouterContext()
  const Router = inRouterContext ? Fragment : MemoryRouter

  const routerProps = inRouterContext ? undefined : memoryRouterProps

  return (
    <Router {...routerProps}>
      {children}
      {buildUrl ? <URLSearchParamsBuilder /> : null}
      <PageEntered />
    </Router>
  )
}
