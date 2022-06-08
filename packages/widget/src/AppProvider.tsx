import { FC, PropsWithChildren } from 'react';
import { QueryClientProvider, QueryClientProviderProps } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
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
  return (
    <WidgetProvider config={config}>
      <ThemeProvider>
        <QueryProvider client={queryClient}>
          <MemoryRouter>
            <WalletProvider>
              <SwapFormProvider>{children}</SwapFormProvider>
            </WalletProvider>
          </MemoryRouter>
        </QueryProvider>
      </ThemeProvider>
    </WidgetProvider>
  );
};
