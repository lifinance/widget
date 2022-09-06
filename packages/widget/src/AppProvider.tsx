import type { QueryClientProviderProps } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import type { FC, PropsWithChildren } from 'react';
import { Fragment } from 'react';
import { MemoryRouter, useInRouterContext } from 'react-router-dom';
import type { WidgetConfig } from '.';
import { queryClient } from './config/queryClient';
import {
  SDKProvider,
  SwapFormProvider,
  TelemetryProvider,
  ThemeProvider,
  WalletProvider,
  WidgetProvider,
} from './providers';

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
  return (
    <WidgetProvider config={config}>
      <SDKProvider>
        <QueryProvider client={queryClient}>
          <TelemetryProvider>
            <WalletProvider>
              <ThemeProvider>
                <SwapFormProvider>
                  <AppRouter>{children}</AppRouter>
                </SwapFormProvider>
              </ThemeProvider>
            </WalletProvider>
          </TelemetryProvider>
        </QueryProvider>
      </SDKProvider>
    </WidgetProvider>
  );
};

export const AppRouter: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const inRouterContext = useInRouterContext();
  const Router = inRouterContext ? Fragment : MemoryRouter;
  return <Router>{children}</Router>;
};
