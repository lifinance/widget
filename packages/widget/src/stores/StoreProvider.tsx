import type { PropsWithChildren } from 'react'
import type { WidgetConfigProps } from '../types/widget'
import { BookmarkStoreProvider } from './bookmarks/BookmarkStore'
import { ChainOrderStoreProvider } from './chains/ChainOrderStore'
import { FormStoreProvider } from './form/FormStore'
import { HeaderStoreProvider } from './header/useHeaderStore'
import { RouteExecutionStoreProvider } from './routes/RouteExecutionStore'
import { SplitSubvariantStoreProvider } from './settings/useSplitSubvariantStore'

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
