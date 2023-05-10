import type { PropsWithChildren } from 'react';
import type { WidgetConfigProps } from '../types';
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
      <RouteExecutionStoreProvider namePrefix={config?.localStorageKeyPrefix}>
        {children}
      </RouteExecutionStoreProvider>
    </SplitSubvariantStoreProvider>
  );
};
