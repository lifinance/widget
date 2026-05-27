import type { PropsWithChildren } from 'react'
import type { WidgetConfigProps } from '../types/widget.js'
import { getSplitMode } from '../utils/variant.js'
import { BookmarkStoreProvider } from './bookmarks/BookmarkStore.js'
import { ChainOrderStoreProvider } from './chains/ChainOrderStore.js'
import { FormStoreProvider } from './form/FormStore.js'
import { HeaderStoreProvider } from './header/useHeaderStore.js'
import { PinnedTokensStoreProvider } from './pinnedTokens/PinnedTokensStore.js'
import { RouteExecutionStoreProvider } from './routes/RouteExecutionStore.js'
import { SplitModeStoreProvider } from './settings/useSplitModeStore.js'

export const StoreProvider: React.FC<PropsWithChildren<WidgetConfigProps>> = ({
  children,
  config,
  formRef,
}) => {
  return (
    <SplitModeStoreProvider
      state={
        config.mode === 'split'
          ? getSplitMode(config.modeOptions?.split)
          : undefined
      }
    >
      <HeaderStoreProvider namePrefix={config?.keyPrefix}>
        <BookmarkStoreProvider namePrefix={config?.keyPrefix}>
          <PinnedTokensStoreProvider namePrefix={config?.keyPrefix}>
            <FormStoreProvider formRef={formRef}>
              <ChainOrderStoreProvider namePrefix={config?.keyPrefix}>
                <RouteExecutionStoreProvider namePrefix={config?.keyPrefix}>
                  {children}
                </RouteExecutionStoreProvider>
              </ChainOrderStoreProvider>
            </FormStoreProvider>
          </PinnedTokensStoreProvider>
        </BookmarkStoreProvider>
      </HeaderStoreProvider>
    </SplitModeStoreProvider>
  )
}
