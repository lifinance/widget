import { ThemeProvider } from '@mui/material/styles';
import { FC, PropsWithChildren } from 'react';
import { QueryClientProvider, QueryClientProviderProps } from 'react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { WidgetConfig } from '.';
import { Header } from './components/Header';
import { MainContainer } from './components/MainContainer';
import { queryClient } from './config/queryClient';
import { SelectTokenPage } from './pages/SelectTokenPage';
import { SelectWalletPage } from './pages/SelectWalletPage';
import { SettingsPage } from './pages/SettingsPage';
import { SwapPage } from './pages/SwapPage';
import { SwappingPage } from './pages/SwappingPage';
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
          <MainContainer sx={config.containerStyle}>
            <WidgetProvider config={config}>
              <WalletProvider>
                <SwapFormProvider>
                  <Header />
                  <Routes>
                    <Route path={routes.home} element={<SwapPage />} />
                    <Route
                      path={routes.selectWallet}
                      element={<SelectWalletPage />}
                    />
                    <Route path={routes.settings} element={<SettingsPage />} />
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
                    <Route path={routes.swap} element={<SwappingPage />} />
                  </Routes>
                </SwapFormProvider>
              </WalletProvider>
            </WidgetProvider>
          </MainContainer>
        </MemoryRouter>
      </QueryProvider>
    </ThemeProvider>
  );
};
