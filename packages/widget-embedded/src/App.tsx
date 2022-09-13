import type { Route, Token } from '@lifi/sdk';
import {
  addChain,
  switchChain,
  switchChainAndAddToken,
} from '@lifi/wallet-management';
import type { RouteExecutionUpdate } from '@lifi/widget';
import {
  LiFiWidget,
  LiFiWidgetDrawer,
  useWidgetEvents,
  WidgetEvent,
} from '@lifi/widget';
import {
  Box,
  // Button,
  Checkbox,
  CssBaseline,
  Drawer,
  FormControlLabel,
  Slider,
  Switch,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { WalletButtons } from './components/WalletButtons';
import { widgetConfig, widgetDrawerConfig } from './config';
import './index.css';
import { useWallet } from './providers/WalletProvider';

export const App = () => {
  const { connect, disconnect, account } = useWallet();
  const widgetEvents = useWidgetEvents();
  const [searchParams] = useState(() =>
    Object.fromEntries(new URLSearchParams(window?.location.search)),
  );
  const [drawer, setDrawer] = useState(() => Boolean(searchParams.drawer));
  const [externalWallerManagement, setExternalWalletManagement] =
    useState<boolean>(false);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [config, setConfig] = useState(widgetConfig);
  const [fontFamily, setFontFamily] = useState('Inter var, Inter, sans-serif');
  const [borderRadius, setBorderRadius] = useState(12);
  const [borderRadiusSecondary, setBorderRadiusSecondary] = useState(6);
  const [primary, setPrimaryColor] = useState('#3F49E1');
  const [secondary, setSecondaryColor] = useState('#F5B5FF');
  const [darkMode, setDarkMode] = useState(prefersDarkMode);

  const [systemColor, setSystemColor] = useState(true);
  const [theme, setTheme] = useState(() =>
    createTheme({
      palette: {
        mode: (systemColor && prefersDarkMode) || darkMode ? 'dark' : 'light',
        primary: {
          main: '#3F49E1',
        },
        secondary: {
          main: '#F5B5FF',
        },
        background: {
          default:
            (systemColor && prefersDarkMode) || darkMode ? '#000' : '#F4F5F6',
        },
      },
    }),
  );

  useEffect(() => {
    setConfig(() => ({
      ...(drawer
        ? widgetDrawerConfig
        : {
            ...widgetConfig,
            appearance: systemColor ? 'auto' : darkMode ? 'dark' : 'light',
            containerStyle: {
              ...widgetConfig.containerStyle,
              border: `1px solid ${
                (systemColor && prefersDarkMode) || darkMode
                  ? 'rgb(66, 66, 66)'
                  : 'rgb(234, 234, 234)'
              }`,
            },
          }),
      theme: {
        palette: {
          primary: {
            main: primary,
          },
          secondary: {
            main: secondary,
          },
        },
        shape: {
          borderRadius,
          borderRadiusSecondary,
        },
        typography: {
          fontFamily,
        },
      },
    }));
  }, [
    borderRadius,
    borderRadiusSecondary,
    darkMode,
    drawer,
    fontFamily,
    prefersDarkMode,
    primary,
    secondary,
    systemColor,
  ]);

  useEffect(() => {
    if (externalWallerManagement) {
      setConfig((config) => ({
        ...config,
        walletManagement: {
          signer: account.signer,
          connect: async () => {
            await connect();
            return account.signer!;
          },
          disconnect: async () => {
            disconnect();
          },
          switchChain: async (reqChainId: number) => {
            await switchChain(reqChainId);
            if (account.signer) {
              return account.signer!;
            }
            throw Error('No signer object after chain switch');
          },
          addToken: async (token: Token, chainId: number) => {
            await switchChainAndAddToken(chainId, token);
          },
          addChain: async (chainId: number) => {
            return addChain(chainId);
          },
        },
      }));
    } else {
      setConfig((config) => ({ ...config, walletManagement: undefined }));
    }
  }, [externalWallerManagement, account.signer, connect, disconnect]);

  useEffect(() => {
    setTheme(
      createTheme({
        palette: {
          mode: (systemColor && prefersDarkMode) || darkMode ? 'dark' : 'light',
          primary: {
            main: primary,
          },
          secondary: {
            main: secondary,
          },
          background: {
            default:
              (systemColor && prefersDarkMode) || darkMode ? '#000' : '#F4F5F6',
          },
        },
      }),
    );
    if (systemColor) {
      setDarkMode(systemColor && prefersDarkMode);
    }
  }, [darkMode, prefersDarkMode, primary, secondary, systemColor]);

  useEffect(() => {
    const onRouteExecutionStarted = (route: Route) => {
      // console.log('onRouteExecutionStarted fired.');
    };
    const onRouteExecutionUpdated = (update: RouteExecutionUpdate) => {
      // console.log('onRouteExecutionUpdated fired.');
    };
    const onRouteExecutionCompleted = (route: Route) => {
      // console.log('onRouteExecutionCompleted fired.');
    };
    const onRouteExecutionFailed = (update: RouteExecutionUpdate) => {
      // console.log('onRouteExecutionFailed fired.');
    };
    widgetEvents.on(WidgetEvent.RouteExecutionStarted, onRouteExecutionStarted);
    widgetEvents.on(WidgetEvent.RouteExecutionUpdated, onRouteExecutionUpdated);
    widgetEvents.on(
      WidgetEvent.RouteExecutionCompleted,
      onRouteExecutionCompleted,
    );
    widgetEvents.on(WidgetEvent.RouteExecutionFailed, onRouteExecutionFailed);
    return () => widgetEvents.all.clear();
  }, [widgetEvents]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Drawer
          sx={{
            width: 320,
            '& .MuiDrawer-paper': {
              width: 320,
              boxSizing: 'border-box',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Box p={2} flex={1}>
            <Typography px={1} mb={2} variant="h6">
              Widget Customization
            </Typography>
            <Box px={1} flex={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={drawer}
                    onChange={() => setDrawer((drawer) => !drawer)}
                  />
                }
                label="Enable drawer view"
              />
            </Box>

            <Box px={1} flex={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={externalWallerManagement}
                    onChange={() =>
                      setExternalWalletManagement((state) => !state)
                    }
                  />
                }
                label="Enable external wallet management"
              />
              {externalWallerManagement && <WalletButtons />}
            </Box>
            <Box p={1} flex={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={systemColor}
                    onChange={() => setSystemColor((system) => !system)}
                  />
                }
                label="Auto"
              />
              <FormControlLabel
                control={
                  <Switch
                    disabled={systemColor}
                    checked={darkMode}
                    onChange={() => setDarkMode((dark) => !dark)}
                  />
                }
                label="Dark theme"
              />
            </Box>
            <Box px={1} pt={1} flex={1}>
              <Typography gutterBottom>Border Radius</Typography>
              <Slider
                valueLabelDisplay="auto"
                components={{
                  ValueLabel: ValueLabelComponent,
                }}
                max={32}
                value={borderRadius}
                onChange={(_, value) => setBorderRadius(value as number)}
                sx={{ width: '100%' }}
              />
            </Box>
            <Box p={1} flex={1}>
              <Typography gutterBottom>Border Radius Secondary</Typography>
              <Slider
                valueLabelDisplay="auto"
                components={{
                  ValueLabel: ValueLabelComponent,
                }}
                max={32}
                value={borderRadiusSecondary}
                onChange={(_, value) =>
                  setBorderRadiusSecondary(value as number)
                }
                sx={{ width: '100%' }}
              />
            </Box>
            <Box p={1}>
              <TextField
                value={fontFamily}
                label="Font Family"
                helperText="Should be loaded apart or has OS support"
                size="small"
                onChange={(event) => setFontFamily(event.target.value)}
                fullWidth
              />
            </Box>
            <Box py={2} px={1}>
              <TextField
                value={primary}
                label="Main Color"
                type="color"
                size="small"
                inputProps={{ sx: { cursor: 'pointer' } }}
                onChange={(event) => setPrimaryColor(event.target.value)}
                fullWidth
              />
            </Box>
            <Box py={2} px={1}>
              <TextField
                value={secondary}
                label="Secondary Color"
                type="color"
                size="small"
                inputProps={{ sx: { cursor: 'pointer' } }}
                onChange={(event) => setSecondaryColor(event.target.value)}
                fullWidth
              />
            </Box>
          </Box>
        </Drawer>
        <Box
          sx={{
            height: '100vh',
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

function ValueLabelComponent({
  children,
  value,
}: {
  children: React.ReactElement;
  value: number;
}) {
  return (
    <Tooltip enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}
