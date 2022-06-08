/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
import { FC, Fragment, PropsWithChildren } from 'react';
import { QueryClientProvider, QueryClientProviderProps } from 'react-query';
import { MemoryRouter, useInRouterContext } from 'react-router-dom';
import { WidgetConfig } from '.';
import { queryClient } from './config/queryClient';
import { SwapFormProvider } from './providers/SwapFormProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { WalletProvider } from './providers/WalletProvider';
import { WidgetProvider } from './providers/WidgetProvider';

export interface AppProps {
  config?: WidgetConfig;
}

const QueryProvider = QueryClientProvider as FC<
  PropsWithChildren<QueryClientProviderProps>
>;

export const AppProvider: React.FC<PropsWithChildren<AppProps>> = ({
  children,
  config,
}) => {
  const inRouterContext = useInRouterContext();
  const Router = inRouterContext ? Fragment : MemoryRouter;
  return (
    <WidgetProvider config={config}>
      <ThemeProvider>
        <QueryProvider client={queryClient}>
          <Router>
            <WalletProvider>
              <SwapFormProvider>{children}</SwapFormProvider>
            </WalletProvider>
          </Router>
        </QueryProvider>
      </ThemeProvider>
    </WidgetProvider>
  );
};
