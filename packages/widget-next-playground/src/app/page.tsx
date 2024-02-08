'use client';

import { type PropsWithChildren } from 'react';
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Box } from '@mui/material';
import { WidgetView } from './components/Widget';
import { DrawerControls } from './components/DrawerControls';
import { Main } from './page.styles';
import { WidgetConfigProvider } from './store';
import { PlaygroundThemeProvider } from './providers';

const queryClient = new QueryClient();

const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WidgetConfigProvider>
        <PlaygroundThemeProvider>{children}</PlaygroundThemeProvider>
      </WidgetConfigProvider>
    </QueryClientProvider>
  );
};

export default function Home() {
  const [isDrawerControlsOpen, setIsDrawerControlsOpen] = useState(true);

  return (
    <AppProvider>
      <Box sx={{ display: 'flex', flexGrow: '1' }}>
        <DrawerControls
          open={isDrawerControlsOpen}
          setDrawerOpen={setIsDrawerControlsOpen}
        />
        <Main open={isDrawerControlsOpen}>
          <WidgetView
            isDrawerOpen={isDrawerControlsOpen}
            setDrawerOpen={setIsDrawerControlsOpen}
          />
        </Main>
      </Box>
    </AppProvider>
  );
}
