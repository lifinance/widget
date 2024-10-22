import type { PropsWithChildren } from 'react'
import type { WidgetConfigProps } from '../types/widget.js'
import { BookmarkStoreProvider } from './bookmarks/BookmarkStore.js'
import { ChainOrderStoreProvider } from './chains/ChainOrderStore.js'
import { FormStoreProvider } from './form/FormStore.js'
import { HeaderStoreProvider } from './header/useHeaderStore.js'
import { RouteExecutionStoreProvider } from './routes/RouteExecutionStore.js'
import { SplitSubvariantStoreProvider } from './settings/useSplitSubvariantStore.js'

export const StoreProvider: React.FC<PropsWithChildren<WidgetConfigProps>> = ({
  children,
  config,
  formRef,
}) => {
  return (
    <SplitSubvariantStoreProvider
      state={
        config.subvariant === 'split'
          ? config.subvariantOptions?.split || 'swap'
          : undefined
      }
    >
      <HeaderStoreProvider namePrefix={config?.keyPrefix}>
        <BookmarkStoreProvider namePrefix={config?.keyPrefix}>
          <FormStoreProvider formRef={formRef}>
            <ChainOrderStoreProvider namePrefix={config?.keyPrefix}>
              <RouteExecutionStoreProvider namePrefix={config?.keyPrefix}>
                {children}
              </RouteExecutionStoreProvider>
            </ChainOrderStoreProvider>
          </FormStoreProvider>
        </BookmarkStoreProvider>
      </HeaderStoreProvider>
    </SplitSubvariantStoreProvider>
  )
}
