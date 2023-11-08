import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { Fragment } from 'react';
import { MemoryRouter, useInRouterContext } from 'react-router-dom';
import { queryClient } from './config/queryClient';
import {
  FormProvider,
  I18nProvider,
  SDKProvider,
  SolanaProvider,
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
          <ThemeProvider>
            <I18nProvider>
              <SolanaProvider>
                <WalletProvider>
                  <SDKProvider>
                    <FormProvider>
                      <AppRouter>{children}</AppRouter>
                    </FormProvider>
                  </SDKProvider>
                </WalletProvider>
              </SolanaProvider>
            </I18nProvider>
          </ThemeProvider>
        </WidgetProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
};

export const AppRouter: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const { buildUrl } = useWidgetConfig();
  const inRouterContext = useInRouterContext();
  const Router = inRouterContext ? Fragment : MemoryRouter;
  return (
    <Router>
      {children}
      {buildUrl ? <URLSearchParamsBuilder /> : null}
    </Router>
  );
};
