import { ThemeProvider } from '@mui/material/styles';
import { FC, PropsWithChildren, useRef } from 'react';
import { QueryClientProvider, QueryClientProviderProps } from 'react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { WidgetConfig } from '.';
import { MainContainer } from './components/MainContainer';
import { NavigationHeader } from './components/NavigationHeader';
import { SettingsDrawerBase } from './components/SettingsDrawer';
import { WalletHeader } from './components/WalletHeader';
import { queryClient } from './config/queryClient';
import { SwapPage } from './pages/SwapPage';
import { TransactionPage } from './pages/TransactionPage';
import { SwapExecutionProvider } from './providers/SwapExecutionProvider';
import { SwapFormProvider } from './providers/SwapFormProvider';
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
  const settingsRef = useRef<SettingsDrawerBase>(null);
  return (
    <ThemeProvider theme={theme}>
      <QueryProvider client={queryClient}>
        <MemoryRouter>
          <MainContainer>
            <WidgetProvider config={config}>
              <SwapFormProvider>
                <WalletHeader />
                <NavigationHeader settingsRef={settingsRef} />
                <SwapExecutionProvider>
                  <Routes>
                    <Route
                      path={routes.home}
                      element={<SwapPage settingsRef={settingsRef} />}
                    >
                      <Route path={routes.fromToken} element={null} />
                      <Route path={routes.toToken} element={null} />
                      <Route path={routes.settings} element={null} />
                      <Route path={routes.selectWallet} element={null} />
                    </Route>
                    <Route
                      path={routes.transaction}
                      element={<TransactionPage />}
                    />
                  </Routes>
                </SwapExecutionProvider>
              </SwapFormProvider>
            </WidgetProvider>
          </MainContainer>
        </MemoryRouter>
      </QueryProvider>
    </ThemeProvider>
  );
};
