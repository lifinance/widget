'use client';

import { type PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Box } from '@mui/material';
import { WidgetView } from './components/Widget';
import { DrawerControls } from './components/DrawerControls';
import { EditToolsProvider, WidgetConfigProvider } from './store';
import { PlaygroundThemeProvider } from './providers';

const queryClient = new QueryClient();

const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <EditToolsProvider>
        <WidgetConfigProvider>
          <PlaygroundThemeProvider>{children}</PlaygroundThemeProvider>
        </WidgetConfigProvider>
      </EditToolsProvider>
    </QueryClientProvider>
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
