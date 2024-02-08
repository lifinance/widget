import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { Fragment } from 'react';
import { MemoryRouter, useInRouterContext } from 'react-router-dom';
import { queryClient } from './config/queryClient.js';
import { I18nProvider } from './providers/I18nProvider/I18nProvider.js';
import { ThemeProvider } from './providers/ThemeProvider/ThemeProvider.js';
import { WalletProvider } from './providers/WalletProvider/WalletProvider.js';
import {
  WidgetProvider,
  useWidgetConfig,
} from './providers/WidgetProvider/WidgetProvider.js';
import { StoreProvider } from './stores/StoreProvider.js';
import { URLSearchParamsBuilder } from './stores/form/URLSearchParamsBuilder.js';
import type { WidgetConfigProps } from './types/widget.js';

export const AppProvider: React.FC<PropsWithChildren<WidgetConfigProps>> = ({
  children,
  config,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WidgetProvider config={config}>
        <WalletProvider>
          <ThemeProvider>
            <I18nProvider>
              <StoreProvider config={config}>
                <AppRouter>{children}</AppRouter>
              </StoreProvider>
            </I18nProvider>
          </ThemeProvider>
        </WalletProvider>
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
