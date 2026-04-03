import {
  DrawerControls,
  EditToolsProvider,
  EnvVariablesProvider,
  FontLoaderProvider,
  PlaygroundThemeProvider,
  WidgetConfigProvider,
  WidgetView,
} from '@lifi/widget-playground'
import { defaultWidgetConfig } from '@lifi/widget-playground/widget-config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { JSX, PropsWithChildren } from 'react'
import '@lifi/widget-playground/fonts'

const queryClient = new QueryClient()

const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <EnvVariablesProvider
      EVMWalletConnectId={import.meta.env.VITE_EVM_WALLET_CONNECT}
    >
      <QueryClientProvider client={queryClient}>
        <WidgetConfigProvider defaultWidgetConfig={defaultWidgetConfig}>
          <EditToolsProvider>
            <PlaygroundThemeProvider>
              <FontLoaderProvider>{children}</FontLoaderProvider>
            </PlaygroundThemeProvider>
          </EditToolsProvider>
        </WidgetConfigProvider>
      </QueryClientProvider>
    </EnvVariablesProvider>
  )
}

export const App = (): JSX.Element => {
  return (
    <AppProvider>
      <div style={{ display: 'flex', flexGrow: '1' }}>
        <DrawerControls />
        <WidgetView />
      </div>
    </AppProvider>
  )
}

if (!import.meta.env.VITE_EVM_WALLET_CONNECT) {
  console.error(
    'VITE_EVM_WALLET_CONNECT is require in your .env.local file for external wallet management'
  )
}

if (
  (import.meta.env.MODE === 'dev' || import.meta.env.MODE === 'staging') &&
  !import.meta.env.VITE_API_KEY
) {
  throw new Error(
    `VITE_API_KEY is required when running in "${import.meta.env.MODE}" mode. ` +
      `Please set it in your .env.${import.meta.env.MODE}.local file.`
  )
}
