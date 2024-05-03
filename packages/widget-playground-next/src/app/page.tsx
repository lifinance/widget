'use client';

import { Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// The core-js/actual/structured-clone polyfill is only needed for the Next.js implementation
// the lack of structureClone support for Next.js is currently a requested feature
//   https://github.com/vercel/next.js/discussions/33189
import 'core-js/actual/structured-clone';
import { type PropsWithChildren } from 'react';

import {
  DrawerControls,
  EditToolsProvider,
  EnvVariablesProvider,
  FontLoaderProvider,
  PlaygroundThemeProvider,
  WidgetConfigProvider,
} from '@lifi/widget-playground';

import { defaultWidgetConfig } from '@lifi/widget-playground/widget-config';

import { WidgetNextView } from '@/app/WidgetNextView';
import '@lifi/widget-playground/fonts';

const queryClient = new QueryClient();

const AppProvider = ({ children }: PropsWithChildren) => {
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
  );
};

export default function Home() {
  return (
    <AppProvider>
      <Box sx={{ display: 'flex', flexGrow: '1' }}>
        <DrawerControls />
        <WidgetNextView />
      </Box>
    </AppProvider>
  );
}

if (!process.env.NEXT_PUBLIC_EVM_WALLET_CONNECT) {
  console.error(
    'NEXT_PUBLIC_EVM_WALLET_CONNECT is require in your .env.local file for external wallet management',
  );
}
