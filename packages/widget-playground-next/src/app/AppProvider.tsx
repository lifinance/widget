'use client'
import {
  EditToolsProvider,
  EnvVariablesProvider,
  FontLoaderProvider,
  PlaygroundThemeProvider,
  WidgetConfigProvider,
} from '@lifi/widget-playground'
import { defaultWidgetConfig } from '@lifi/widget-playground/widget-config'
import { QueryClientProvider } from '@tanstack/react-query'
import { type PropsWithChildren, useState } from 'react'
// The core-js/actual/structured-clone polyfill is only needed for the Next.js implementation
// the lack of structureClone support for Next.js is currently a requested feature
//   https://github.com/vercel/next.js/discussions/33189
import 'core-js/actual/structured-clone'
import '@lifi/widget-playground/fonts'
import { getQueryClient } from './getQueryClient'

export const AppProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => getQueryClient())
  return (
    <EnvVariablesProvider
      EVMWalletConnectId={process.env.NEXT_PUBLIC_EVM_WALLET_CONNECT!}
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
