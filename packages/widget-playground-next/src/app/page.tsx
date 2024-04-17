'use client';

// This polyfill is only needed for the Next.js implementation
// the lack of structureClone support for Next.js is currently a requested feature
//   https://github.com/vercel/next.js/discussions/33189
import { WidgetNextView } from '@/app/WidgetNextView';
import {
  DrawerControls,
  EditToolsProvider,
  EnvVariablesProvider,
  FontLoaderProvider,
  PlaygroundThemeProvider,
  WidgetConfigProvider,
} from '@lifi/widget-playground';
import '@lifi/widget-playground/fonts';
import { defaultWidgetConfig } from '@lifi/widget-playground/widget-config';
import { Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'core-js/actual/structured-clone';
import { type PropsWithChildren } from 'react';

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
