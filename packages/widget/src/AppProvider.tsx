import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { Fragment } from 'react';
import { MemoryRouter, useInRouterContext } from 'react-router-dom';
import { queryClient } from './config/queryClient';
import {
  I18nProvider,
  SDKProvider,
  SwapFormProvider,
  ThemeProvider,
  WalletProvider,
  WidgetProvider,
} from './providers';
import { StoreProvider } from './stores';
import type { WidgetProps } from './types';

export const AppProvider: React.FC<PropsWithChildren<WidgetProps>> = ({
  children,
  config,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider namePrefix={config?.localStorageKeyPrefix}>
        <WidgetProvider config={config}>
          <SDKProvider>
            {/* <TelemetryProvider> */}
            <ThemeProvider>
              <I18nProvider>
                <WalletProvider>
                  <SwapFormProvider>
                    <AppRouter>{children}</AppRouter>
                  </SwapFormProvider>
                </WalletProvider>
              </I18nProvider>
            </ThemeProvider>
            {/* </TelemetryProvider> */}
          </SDKProvider>
        </WidgetProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
};

export const AppRouter: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const inRouterContext = useInRouterContext();
  const Router = inRouterContext ? Fragment : MemoryRouter;
  return <Router>{children}</Router>;
};
