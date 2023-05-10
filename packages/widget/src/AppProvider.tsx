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
  URLSearchParamsBuilder,
  WalletProvider,
  WidgetProvider,
  useWidgetConfig,
} from './providers';
import { StoreProvider } from './stores';
import type { WidgetConfigProps } from './types';

export const AppProvider: React.FC<PropsWithChildren<WidgetConfigProps>> = ({
  children,
  config,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider config={config}>
        <WidgetProvider config={config}>
          <SDKProvider>
            <ThemeProvider>
              <I18nProvider>
                <WalletProvider>
                  <SwapFormProvider>
                    <AppRouter>{children}</AppRouter>
                  </SwapFormProvider>
                </WalletProvider>
              </I18nProvider>
            </ThemeProvider>
          </SDKProvider>
        </WidgetProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
};

export const AppRouter: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const { buildSwapUrl } = useWidgetConfig();
  const inRouterContext = useInRouterContext();
  const Router = inRouterContext ? Fragment : MemoryRouter;
  return (
    <Router>
      {children}
      {buildSwapUrl ? <URLSearchParamsBuilder /> : null}
    </Router>
  );
};
