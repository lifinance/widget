/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
import {
  QueryClientProvider,
  QueryClientProviderProps,
} from '@tanstack/react-query';
import { FC, Fragment, PropsWithChildren } from 'react';
import { MemoryRouter, useInRouterContext } from 'react-router-dom';
import { WidgetConfig } from '.';
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
  useTelemetry(config?.disableTelemetry);
  return (
    <WidgetProvider config={config}>
      <ThemeProvider>
        <QueryProvider client={queryClient}>
          <WalletProvider>
            <SwapFormProvider>
              <AppRouter>{children}</AppRouter>
            </SwapFormProvider>
          </WalletProvider>
        </QueryProvider>
      </ThemeProvider>
    </WidgetProvider>
  );
};

export const AppRouter: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const inRouterContext = useInRouterContext();
  const Router = inRouterContext ? Fragment : MemoryRouter;
  return <Router>{children}</Router>;
};
