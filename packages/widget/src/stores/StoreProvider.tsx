import type { PropsWithChildren } from 'react';
import { RouteExecutionStoreProvider } from './routes';
import type { PersistStoreProviderProps } from './types';

export const StoreProvider: React.FC<
  PropsWithChildren<PersistStoreProviderProps>
> = ({ children, namePrefix }) => {
  return (
    <RouteExecutionStoreProvider namePrefix={namePrefix}>
      {children}
    </RouteExecutionStoreProvider>
  );
};
