import { Container } from '@mui/material';
import { styled, ThemeProvider } from '@mui/material/styles';
import { useRef } from 'react';
import { QueryClientProvider } from 'react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { WidgetConfig } from '.';
import { NavigationHeader } from './components/NavigationHeader';
import { SettingsDrawerBase } from './components/SettingsDrawer';
import { WalletHeader } from './components/WalletHeader';
import { queryClient } from './config/queryClient';
import { SwapPage } from './pages/SwapPage';
import { SwapFormProvider } from './providers/SwapFormProvider';
import { WidgetProvider } from './providers/WidgetProvider';
import { theme } from './theme';
import { routes } from './utils/routes';

const MainContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflowX: 'clip',
}));

interface AppProps {
  config: WidgetConfig;
}

export const App: React.FC<AppProps> = ({ config }) => {
  const settingsRef = useRef<SettingsDrawerBase>(null);
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MainContainer maxWidth="sm" disableGutters>
            <WidgetProvider config={config}>
              <SwapFormProvider>
                <WalletHeader />
                <NavigationHeader settingsRef={settingsRef} />
                <Routes>
                  <Route
                    path={routes.home}
                    element={<SwapPage settingsRef={settingsRef} />}
                  >
                    <Route path={routes.selectToken} element={null} />
                    <Route path={routes.settings} element={null} />
                    <Route path={routes.selectWallet} element={null} />
                  </Route>
                </Routes>
              </SwapFormProvider>
            </WidgetProvider>
          </MainContainer>
        </MemoryRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
};
