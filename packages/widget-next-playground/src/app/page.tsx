'use client';

import React, { PropsWithChildren, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Box } from '@mui/material';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import CloseIcon from '@mui/icons-material/Close';
import { Widget } from './components/Widget';
import { DrawerControls } from './components/DrawerControls';
import { Main, OpenButton } from './page.styles';
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
  const [open, setOpen] = useState(true);

  return (
    <AppProvider>
      <Box sx={{ display: 'flex' }}>
        <DrawerControls open={open} />
        <OpenButton onClick={() => setOpen(!open)} open={open}>
          {open ? <CloseIcon /> : <MenuOpenIcon />}
        </OpenButton>
        <Main open={open}>
          <Widget />
        </Main>
      </Box>
    </AppProvider>
  );
}
