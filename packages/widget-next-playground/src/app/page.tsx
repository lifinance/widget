'use client';

import React, { useEffect, useState } from 'react';
import { Widget } from './components/Widget';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import CloseIcon from '@mui/icons-material/Close';
import { DrawerControls } from './components/DrawerControls';
import { Main, OpenButton } from './page.styles';
import { theme } from './theme';
import { useConfigActions, WidgetConfigProvider } from './store';
import { defaultWidgetConfig } from './store/defaultWidgetConfig';

export default function Home() {
  const [open, setOpen] = useState(true);

  return (
    <WidgetConfigProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
          <DrawerControls open={open} />
          <OpenButton
            onClick={() => setOpen(!open)}
            color="primary"
            open={open}
          >
            {open ? <CloseIcon /> : <MenuOpenIcon />}
          </OpenButton>
          <Main open={open}>
            <Widget />
          </Main>
        </Box>
      </ThemeProvider>
    </WidgetConfigProvider>
  );
}
