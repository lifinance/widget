import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { Fragment } from 'react';
import { MemoryRouter, useInRouterContext } from 'react-router-dom';
import { queryClient } from './config/queryClient';
import {
  FormProvider,
  I18nProvider,
  SDKProvider,
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
      <WidgetProvider config={config}>
        <SDKProvider>
          <ThemeProvider>
            <I18nProvider>
              <WalletProvider>
                <FormProvider>
                  <StoreProvider config={config}>
                    <AppRouter>{children}</AppRouter>
                  </StoreProvider>
                </FormProvider>
              </WalletProvider>
            </I18nProvider>
          </ThemeProvider>
        </SDKProvider>
      </WidgetProvider>
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
