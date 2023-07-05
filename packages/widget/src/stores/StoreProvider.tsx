import type { PropsWithChildren } from 'react';
import type { WidgetConfigProps } from '../types';
import { HeaderStoreProvider } from './header';
import { RouteExecutionStoreProvider } from './routes';
import { SplitSubvariantStoreProvider } from './settings';

export const StoreProvider: React.FC<PropsWithChildren<WidgetConfigProps>> = ({
  children,
  config,
}) => {
  return (
    <SplitSubvariantStoreProvider
      state={config.subvariant === 'split' ? 'swap' : undefined}
    >
      <HeaderStoreProvider namePrefix={config?.keyPrefix}>
        <RouteExecutionStoreProvider namePrefix={config?.keyPrefix}>
          {children}
        </RouteExecutionStoreProvider>
      </HeaderStoreProvider>
    </SplitSubvariantStoreProvider>
  );
};
