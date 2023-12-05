import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { Fragment } from 'react';
import { MemoryRouter, useInRouterContext } from 'react-router-dom';
import { queryClient } from './config/queryClient';
import {
  FormProvider,
  I18nProvider,
  ThemeProvider,
  URLSearchParamsBuilder,
  WalletProvider,
  WidgetProvider,
  useWidgetConfig,
} from './providers';
import { StoreProvider } from './stores';
import type { WidgetConfigProps } from './types';
import { FormStoreProvider } from './stores/form/FormStore';

export const AppProvider: React.FC<PropsWithChildren<WidgetConfigProps>> = ({
  children,
  config,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WidgetProvider config={config}>
        <ThemeProvider>
          <I18nProvider>
            <WalletProvider>
              <FormStoreProvider>
                <FormProvider>
                  <StoreProvider config={config}>
                    <AppRouter>{children}</AppRouter>
                  </StoreProvider>
                </FormProvider>
              </FormStoreProvider>
            </WalletProvider>
          </I18nProvider>
        </ThemeProvider>
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
