/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
import type { QueryClientProviderProps } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import type { FC, PropsWithChildren } from 'react';
import { Fragment } from 'react';
import { MemoryRouter, useInRouterContext } from 'react-router-dom';
import type { WidgetConfig } from '.';
import { queryClient } from './config/queryClient';
import { useTelemetry } from './hooks';
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
  return (
    <QueryProvider client={queryClient}>
      <TelemetryProvider disabled={config?.disableTelemetry}>
        <WalletProvider walletManagement={config?.walletManagement}>
          <WidgetProvider config={config}>
            <ThemeProvider>
              <SwapFormProvider>
                <AppRouter>{children}</AppRouter>
              </SwapFormProvider>
            </ThemeProvider>
          </WidgetProvider>
        </WalletProvider>
      </TelemetryProvider>
    </QueryProvider>
  );
};

export const AppRouter: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const inRouterContext = useInRouterContext();
  const Router = inRouterContext ? Fragment : MemoryRouter;
  return <Router>{children}</Router>;
};

export const TelemetryProvider: React.FC<{
  children: React.ReactElement<any, any> | null;
  disabled?: boolean;
}> = ({ children, disabled }) => {
  useTelemetry(disabled);
  return children;
};
