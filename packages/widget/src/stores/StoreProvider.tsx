import type { PropsWithChildren } from 'react';
import type { WidgetConfigProps } from '../types/widget.js';
import { BookmarkStoreProvider } from './bookmarks/BookmarkStore.js';
import { ChainOrderStoreProvider } from './chains/ChainOrderStore.js';
import { FormStoreProvider } from './form/FormStore.js';
import { HeaderStoreProvider } from './header/useHeaderStore.js';
import { RouteExecutionStoreProvider } from './routes/RouteExecutionStore.js';
import { SplitSubvariantStoreProvider } from './settings/useSplitSubvariantStore.js';

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
        <FormStoreProvider>
          <BookmarkStoreProvider namePrefix={config?.keyPrefix}>
            <ChainOrderStoreProvider namePrefix={config?.keyPrefix}>
              <RouteExecutionStoreProvider namePrefix={config?.keyPrefix}>
                {children}
              </RouteExecutionStoreProvider>
            </ChainOrderStoreProvider>
          </BookmarkStoreProvider>
        </FormStoreProvider>
      </HeaderStoreProvider>
    </SplitSubvariantStoreProvider>
  );
};
