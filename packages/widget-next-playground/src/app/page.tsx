'use client';

import React, { PropsWithChildren, useState } from 'react';
import { Widget } from './components/Widget';
import { Box } from '@mui/material';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import CloseIcon from '@mui/icons-material/Close';
import { DrawerControls } from './components/DrawerControls';
import { Main, OpenButton } from './page.styles';
import { WidgetConfigProvider } from './store';
import { PlaygroundThemeProvider } from './providers';

const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <WidgetConfigProvider>
      <PlaygroundThemeProvider>{children}</PlaygroundThemeProvider>
    </WidgetConfigProvider>
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
