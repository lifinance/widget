'use client';

import { type PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Box } from '@mui/material';

import {
  EnvVariablesProvider,
  EditToolsProvider,
  WidgetConfigProvider,
  PlaygroundThemeProvider,
  DrawerControls,
  WidgetView,
} from '@lifi/widget-playground';

import '@lifi/widget-playground/fonts';

import { defaultWidgetConfig } from './defaultWidgetConfig';

const queryClient = new QueryClient();

const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <EnvVariablesProvider
      EVMWalletConnectId={process.env.NEXT_PUBLIC_EVM_WALLET_CONNECT!}
    >
      <QueryClientProvider client={queryClient}>
        <EditToolsProvider>
          <WidgetConfigProvider defaultWidgetConfig={defaultWidgetConfig}>
            <PlaygroundThemeProvider>{children}</PlaygroundThemeProvider>
          </WidgetConfigProvider>
        </EditToolsProvider>
      </QueryClientProvider>
    </EnvVariablesProvider>
  );
};

export default function Home() {
  return (
    <AppProvider>
      <Box sx={{ display: 'flex', flexGrow: '1' }}>
        <DrawerControls />
        <WidgetView />
      </Box>
    </AppProvider>
  );
}

if (!process.env.NEXT_PUBLIC_EVM_WALLET_CONNECT) {
  console.error(
    'NEXT_PUBLIC_EVM_WALLET_CONNECT is require in your .env.local file for external wallet management',
  );
}
