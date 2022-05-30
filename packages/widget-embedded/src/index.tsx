import { LiFiWidget, LiFiWidgetDrawer, WidgetConfig } from '@lifinance/widget';
import {
  Box,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormLabel,
  Switch,
  TextField,
  useMediaQuery,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { reportWebVitals } from './reportWebVitals';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element.');
}
const root = createRoot(rootElement);

const widgetDrawerConfig: WidgetConfig = {
  enabledChains: JSON.parse(process.env.LIFI_ENABLED_CHAINS_JSON!),
  fromChain: 'pol',
  toChain: 'bsc',
  // fromToken: '0x0000000000000000000000000000000000000000',
  // toToken: '0xcc42724c6683b7e57334c4e856f4c9965ed682bd',
  useInternalWalletManagement: true,
};

const widgetConfig: WidgetConfig = {
  ...widgetDrawerConfig,
  containerStyle: {
    width: 392,
    height: 640,
    border: `1px solid ${
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'rgb(66, 66, 66)'
        : 'rgb(234, 234, 234)'
    }`,
    borderRadius: '16px',
    display: 'flex',
    maxWidth: 392,
  },
};

const App = () => {
  const [drawer, setDrawer] = useState(false);
  const [primary, setPrimaryColor] = useState('#3F49E1');
  const [config, setConfig] = useState(widgetConfig);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [theme, setTheme] = useState(() =>
    createTheme({
      palette: {
        mode: prefersDarkMode ? 'dark' : 'light',
        primary: {
          main: '#3F49E1',
        },
      },
    }),
  );

  useEffect(() => {
    setConfig((config) => ({
      ...(drawer
        ? widgetDrawerConfig
        : {
            ...widgetConfig,
            containerStyle: {
              ...widgetConfig.containerStyle,
              border: `1px solid ${
                prefersDarkMode ? 'rgb(66, 66, 66)' : 'rgb(234, 234, 234)'
              }`,
            },
          }),
      paletteOptions: {
        primary: {
          main: primary,
        },
      },
    }));
  }, [drawer, prefersDarkMode, primary]);

  useEffect(() => {
    setTheme(
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          primary: {
            main: '#3F49E1',
          },
        },
      }),
    );
  }, [prefersDarkMode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
          <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend">Widget view</FormLabel>
            <FormControlLabel
              control={
                <Switch
                  checked={drawer}
                  onChange={() => setDrawer((drawer) => !drawer)}
                />
              }
              label="Enable drawer"
            />
          </FormControl>
          <TextField
            value={primary}
            type="color"
            size="small"
            InputProps={{
              sx: {
                width: 64,
              },
            }}
            onChange={(event) => setPrimaryColor(event.target.value)}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}
        >
          {drawer ? (
            <LiFiWidgetDrawer config={config} open />
          ) : (
            <LiFiWidget config={config} />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (process.env.NODE_ENV === 'development') {
  reportWebVitals(console.log);
}
