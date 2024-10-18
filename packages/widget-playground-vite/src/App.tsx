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
import { Box } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import '@lifi/widget-playground/fonts'

const queryClient = new QueryClient()

// const router = createBrowserRouter([
//   {
//     path: '/test/*',
//     element: (
//       <Box sx={{ display: 'flex', flexGrow: '1' }}>
//         <DrawerControls />
//         <WidgetView />
//       </Box>
//     ),
//   },
// ]);

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

export const App = () => {
  return (
    <AppProvider>
      {/* <RouterProvider router={router} /> */}
      <Box sx={{ display: 'flex', flexGrow: '1' }}>
        <DrawerControls />
        <WidgetView />
      </Box>
    </AppProvider>
  )
}

if (!import.meta.env.VITE_EVM_WALLET_CONNECT) {
  console.error(
    'VITE_EVM_WALLET_CONNECT is require in your .env.local file for external wallet management'
  )
}
