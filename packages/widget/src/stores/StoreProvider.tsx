import type { PropsWithChildren } from 'react';
import { ChainOrderStoreProvider } from './chains';
import { RouteExecutionStoreProvider } from './routes';
import { SettingsStoreProvider } from './settings';
import type { PersistStoreProviderProps } from './types';

export const StoreProvider: React.FC<
  PropsWithChildren<PersistStoreProviderProps>
> = ({ children, namePrefix }) => {
  return (
    <RouteExecutionStoreProvider namePrefix={namePrefix}>
      {/* We don't want separate settings in each widget instance for now. */}
      <SettingsStoreProvider
      // namePrefix={namePrefix}
      >
        <ChainOrderStoreProvider namePrefix={namePrefix}>
          {children}
        </ChainOrderStoreProvider>
      </SettingsStoreProvider>
    </RouteExecutionStoreProvider>
  );
};
