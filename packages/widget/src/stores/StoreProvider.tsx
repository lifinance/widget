import type { PropsWithChildren } from 'react';
import {
  RecommendedRouteStoreProvider,
  RouteExecutionStoreProvider,
} from './routes';
import type { PersistStoreProviderProps } from './types';

export const StoreProvider: React.FC<
  PropsWithChildren<PersistStoreProviderProps>
> = ({ children, namePrefix }) => {
  return (
    <RouteExecutionStoreProvider namePrefix={namePrefix}>
      <RecommendedRouteStoreProvider>{children}</RecommendedRouteStoreProvider>
    </RouteExecutionStoreProvider>
  );
};
