import type { PropsWithChildren } from 'react';
import type { WidgetConfigProps } from '../types';
import { ChainOrderStoreProvider } from './chains';
import { HeaderStoreProvider } from './header';
import { RouteExecutionStoreProvider } from './routes';
import { SplitSubvariantStoreProvider } from './settings';

export const StoreProvider: React.FC<PropsWithChildren<WidgetConfigProps>> = ({
  children,
  config,
}) => {
  return (
    <SplitSubvariantStoreProvider
      state={
        config.subvariant === 'split'
          ? config.subvariantOptions || 'swap'
          : undefined
      }
    >
      <HeaderStoreProvider namePrefix={config?.keyPrefix}>
        <ChainOrderStoreProvider namePrefix={config?.keyPrefix}>
          <RouteExecutionStoreProvider namePrefix={config?.keyPrefix}>
            {children}
          </RouteExecutionStoreProvider>
        </ChainOrderStoreProvider>
      </HeaderStoreProvider>
    </SplitSubvariantStoreProvider>
  );
};
