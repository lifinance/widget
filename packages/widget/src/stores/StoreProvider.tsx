import type { PropsWithChildren } from 'react'
import type { WidgetConfigProps } from '../types/widget.js'
import { resolveStorageScopeKey } from '../utils/scopeKeys.js'
import { BookmarkStoreProvider } from './bookmarks/BookmarkStore.js'
import { ChainOrderStoreProvider } from './chains/ChainOrderStore.js'
import { FormStoreProvider } from './form/FormStore.js'
import { HeaderStoreProvider } from './header/useHeaderStore.js'
import { NavigationTabsStoreProvider } from './navigationTabs/useNavigationTabsStore.js'
import { PinnedTokensStoreProvider } from './pinnedTokens/PinnedTokensStore.js'
import { RecentTokensStoreProvider } from './recentTokens/RecentTokensStore.js'
import { RouteExecutionStoreProvider } from './routes/RouteExecutionStore.js'

export const StoreProvider: React.FC<PropsWithChildren<WidgetConfigProps>> = ({
  children,
  config,
  formRef,
}) => {
  const storageScopeKey = resolveStorageScopeKey(config)
  return (
    <NavigationTabsStoreProvider config={config}>
      <HeaderStoreProvider>
        <BookmarkStoreProvider namePrefix={storageScopeKey}>
          <PinnedTokensStoreProvider namePrefix={storageScopeKey}>
            <RecentTokensStoreProvider namePrefix={storageScopeKey}>
              <FormStoreProvider formRef={formRef}>
                <ChainOrderStoreProvider namePrefix={storageScopeKey}>
                  <RouteExecutionStoreProvider namePrefix={storageScopeKey}>
                    {children}
                  </RouteExecutionStoreProvider>
                </ChainOrderStoreProvider>
              </FormStoreProvider>
            </RecentTokensStoreProvider>
          </PinnedTokensStoreProvider>
        </BookmarkStoreProvider>
      </HeaderStoreProvider>
    </NavigationTabsStoreProvider>
  )
}
