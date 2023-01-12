import type { PropsWithChildren } from 'react';

export interface PersistStoreProps {
  namePrefix?: string;
}

export type PersistStoreProviderProps = PropsWithChildren<PersistStoreProps>;
