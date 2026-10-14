/** @vitest-environment happy-dom */

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { WidgetConfig } from '../types/widget.js'

/**
 * The persisted stores are named from the resolved storage scope. An
 * integration that only set the deprecated keyPrefix must keep the store
 * names it always had, or its users lose their saved state.
 */

const { recorded, recorder } = vi.hoisted(() => {
  const recorded = { namePrefix: {} as Record<string, string | undefined> }
  const recorder = (name: string) => ({
    [name]: ({
      children,
      namePrefix,
    }: {
      children?: unknown
      namePrefix?: string
    }) => {
      recorded.namePrefix[name] = namePrefix
      return children
    },
  })
  return { recorded, recorder }
})

vi.mock('./bookmarks/BookmarkStore.js', () => recorder('BookmarkStoreProvider'))
vi.mock('./chains/ChainOrderStore.js', () =>
  recorder('ChainOrderStoreProvider')
)
vi.mock('./form/FormStore.js', () => recorder('FormStoreProvider'))
vi.mock('./header/useHeaderStore.js', () => recorder('HeaderStoreProvider'))
vi.mock('./navigationTabs/useNavigationTabsStore.js', () =>
  recorder('NavigationTabsStoreProvider')
)
vi.mock('./pinnedTokens/PinnedTokensStore.js', () =>
  recorder('PinnedTokensStoreProvider')
)
vi.mock('./recentTokens/RecentTokensStore.js', () =>
  recorder('RecentTokensStoreProvider')
)
vi.mock('./routes/RouteExecutionStore.js', () =>
  recorder('RouteExecutionStoreProvider')
)

import { StoreProvider } from './StoreProvider.js'

const PERSISTED = [
  'BookmarkStoreProvider',
  'PinnedTokensStoreProvider',
  'RecentTokensStoreProvider',
  'ChainOrderStoreProvider',
  'RouteExecutionStoreProvider',
]

let root: Root

const render = async (config: WidgetConfig) => {
  await act(async () => {
    root.render(<StoreProvider config={config}>{null}</StoreProvider>)
  })
}

describe('StoreProvider storage scope', () => {
  beforeEach(() => {
    recorded.namePrefix = {}
    const container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(async () => {
    await act(async () => root.unmount())
  })

  it('names the persisted stores from keyPrefix when only that is set', async () => {
    await render({ integrator: 'test', keyPrefix: 'legacy' })

    for (const store of PERSISTED) {
      expect(recorded.namePrefix[store]).toBe('legacy')
    }
  })

  it('names the persisted stores from storageScopeKey over keyPrefix', async () => {
    await render({
      integrator: 'test',
      keyPrefix: 'legacy',
      storageScopeKey: 'store',
    })

    for (const store of PERSISTED) {
      expect(recorded.namePrefix[store]).toBe('store')
    }
  })

  it('keeps the historical names when nothing is set', async () => {
    await render({ integrator: 'test' })

    for (const store of PERSISTED) {
      expect(recorded.namePrefix[store]).toBeUndefined()
    }
  })
})
