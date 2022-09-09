import type { Token } from '@lifi/sdk';
import {
  addChain,
  switchChain,
  switchChainAndAddToken,
} from '@lifi/wallet-management';
import type { WidgetConfig } from '@lifi/widget';
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
import './index.css';
import { useWallet } from './providers/WalletProvider';

const widgetDrawerConfig: WidgetConfig = {
  // fromChain: 137,
  // toChain: 10,
  // fromToken: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  // toToken: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
  // fromAmount: '10',
  // disableColorSchemes: true,
  disableTelemetry: true,
  integrator: 'li.fi-playground',
  disabledChains: [],
  chains: {
    allow: [], // 1, 1285, 10, 56, 137
    deny: [],
  },
  // sdkConfig: {
  //   apiUrl: 'https://developkub.li.finance/v1/',
  // },
  tokens: {
    featured: [
      {
        address: '0x195e3087ea4d7eec6e9c37e9640162fe32433d5e',
        symbol: '$ALTI',
        decimals: 18,
        chainId: 56,
        name: 'Altimatum',
        logoURI:
          'https://s2.coinmarketcap.com/static/img/coins/64x64/21303.png',
      },
      {
        address: '0x60d8d17d6b824e19f77eaccaf16ed7ba6fb209c2',
        symbol: 'SERENE',
        decimals: 18,
        chainId: 250,
        name: 'Serenity V2',
        logoURI:
          'https://static.debank.com/image/ftm_token/logo_url/0x60d8d17d6b824e19f77eaccaf16ed7ba6fb209c2/5842f60d05f1d9ce473d0c3f70917c86.png',
      },
      {
        address: '0x2fd6c9b869dea106730269e13113361b684f843a',
        symbol: 'CHH',
        decimals: 9,
        chainId: 56,
        name: 'Chihuahua',
        priceUSD: '2.8497281105098143e-11',
        logoURI:
          'https://s2.coinmarketcap.com/static/img/coins/64x64/21334.png',
      },
    ],
    deny: [
      // {
      //   address: '0x4200000000000000000000000000000000000006',
      //   chainId: 10,
      // },
      // {
      //   address: '0x0000000000000000000000000000000000000000',
      //   chainId: 10,
      // },
      // {
      //   address: '0x4200000000000000000000000000000000000042',
      //   chainId: 10,
      //   decimals: 18,
      //   logoURI:
      //     'https://static.debank.com/image/op_token/logo_url/0x4200000000000000000000000000000000000042/95a6d2edd6dac44e08dd277bb10fbfe9.png',
      //   name: 'Optimism',
      //   priceUSD: '1.149',
      //   symbol: 'OP',
      // },
    ],
    allow: [
      // {
      //   address: '0x4200000000000000000000000000000000000042',
      //   chainId: 10,
      //   decimals: 18,
      //   logoURI:
      //     'https://static.debank.com/image/op_token/logo_url/0x4200000000000000000000000000000000000042/95a6d2edd6dac44e08dd277bb10fbfe9.png',
      //   name: 'Optimism',
      //   priceUSD: '1.149',
      //   symbol: 'OP',
      // },
    ],
  },
  bridges: {
    // allow: ['stargate'],
    // deny: ['connext'],
  },
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
    const onSwapStarted = () => {
      console.log('onSwapStarted fired.');
    };
    widgetEvents.on(WidgetEvent.SwapStarted, onSwapStarted);
    return () => {
      widgetEvents.removeListener(WidgetEvent.SwapStarted, onSwapStarted);
    };
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
            <Box>
              {/* <Button
                onClick={() => {
                  walletCallbacks.connect();
                  setSigner(provider.getSigner());
                }}
              >
                Connect
              </Button>
              <Button
                onClick={() => {
                  walletCallbacks.disconnect();
                  setSigner(undefined);
                }}
              >
                Disconnect
              </Button>
              <Button
                onClick={async () => {
                  await walletCallbacks.switchChain(1);
                  setSigner(provider.getSigner());
                }}
              >
                Switch Chain To ETH
              </Button> */}
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
