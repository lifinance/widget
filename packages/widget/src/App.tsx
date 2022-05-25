import { ScopedCssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { FC, PropsWithChildren } from 'react';
import { QueryClientProvider, QueryClientProviderProps } from 'react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { WidgetConfig } from '.';
import { AppContainer } from './components/AppContainer';
import { Header } from './components/Header';
import { queryClient } from './config/queryClient';
import { MainPage } from './pages/MainPage';
import { SelectTokenPage } from './pages/SelectTokenPage';
import { SelectWalletPage } from './pages/SelectWalletPage';
import { SettingsPage } from './pages/SettingsPage';
import { SwapPage } from './pages/SwapPage';
import { SwapRoutesPage } from './pages/SwapRoutesPage';
import { SwapFormProvider } from './providers/SwapFormProvider';
import { WalletProvider } from './providers/WalletProvider';
import { WidgetProvider } from './providers/WidgetProvider';
import { theme } from './theme';
import { routes } from './utils/routes';

interface AppProps {
  config: WidgetConfig;
}

const QueryProvider = QueryClientProvider as FC<
  PropsWithChildren<QueryClientProviderProps>
>;

export const App: React.FC<AppProps> = ({ config }) => {
  return (
    <ThemeProvider theme={theme}>
      <QueryProvider client={queryClient}>
        <MemoryRouter>
          <WidgetProvider config={config}>
            <WalletProvider>
              <SwapFormProvider>
                <ScopedCssBaseline enableColorScheme>
                  <AppContainer sx={config.containerStyle}>
                    <Header />
                    <Routes>
                      <Route path={routes.home} element={<MainPage />} />
                      <Route
                        path={routes.selectWallet}
                        element={<SelectWalletPage />}
                      />
                      <Route
                        path={routes.settings}
                        element={<SettingsPage />}
                      />
                      <Route
                        path={routes.fromToken}
                        element={<SelectTokenPage formType="from" />}
                      />
                      <Route
                        path={routes.toToken}
                        element={<SelectTokenPage formType="to" />}
                      />
                      <Route
                        path={routes.swapRoutes}
                        element={<SwapRoutesPage />}
                      />
                      <Route path={routes.swap} element={<SwapPage />} />
                    </Routes>
                  </AppContainer>
                </ScopedCssBaseline>
              </SwapFormProvider>
            </WalletProvider>
          </WidgetProvider>
        </MemoryRouter>
      </QueryProvider>
    </ThemeProvider>
  );
};
