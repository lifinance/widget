// @vitest-environment happy-dom

import type { WidgetConfig } from '@lifi/widget/shared'
import { render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { namePrefixes, Pass } = vi.hoisted(() => ({
  namePrefixes: [] as (string | undefined)[],
  Pass: ({ children }: { children?: ReactNode }) => children,
}))

vi.mock('@lifi/widget/shared', () => ({
  BookmarkStoreProvider: ({
    children,
    namePrefix,
  }: {
    children?: ReactNode
    namePrefix?: string
  }) => {
    namePrefixes.push(namePrefix)
    return children
  },
  I18nProvider: Pass,
  QueryClientProvider: Pass,
  SDKClientProvider: Pass,
  SettingsStoreProvider: Pass,
  WalletProvider: Pass,
  WidgetProvider: Pass,
  resolveStorageScopeKey: (config?: {
    storageScopeKey?: string
    keyPrefix?: string
  }) => config?.storageScopeKey ?? config?.keyPrefix,
}))
vi.mock('../hooks/useCheckoutExchangesOverride.js', () => ({
  INTENT_FACTORY_ONLY: [],
}))
vi.mock('../hooks/useFrozenQuote.js', () => ({
  FrozenQuoteStoreProvider: Pass,
}))
vi.mock('../stores/useCheckoutFlowStore.js', () => ({
  CheckoutFlowStoreProvider: Pass,
  useCheckoutFlowStore: () => undefined,
}))
vi.mock('../stores/useFiatCurrencyStore.js', () => ({
  FiatCurrencyStoreProvider: Pass,
}))
vi.mock('./CheckoutSdkBridge.js', () => ({ CheckoutSdkBridge: Pass }))
vi.mock('./OnRampProvider/OnRampProvider.js', () => ({
  OnRampProviderRegistry: Pass,
}))
vi.mock('./PendingCheckoutPersistenceBridge.js', () => ({
  PendingCheckoutPersistenceBridge: Pass,
}))
vi.mock('./ThemeProvider.js', () => ({ ThemeProvider: Pass }))

const { CheckoutAppProvider } = await import('./CheckoutAppProvider.js')

const renderWith = (config: Partial<WidgetConfig>) =>
  render(
    <CheckoutAppProvider
      widgetConfig={{ integrator: 'test', ...config } as WidgetConfig}
      onRampProviders={[]}
    >
      {null}
    </CheckoutAppProvider>
  )

describe('CheckoutAppProvider bookmarks store', () => {
  beforeEach(() => {
    namePrefixes.length = 0
  })

  it('names the store from storageScopeKey', () => {
    renderWith({ storageScopeKey: 'scoped', keyPrefix: 'legacy' })

    expect(namePrefixes.at(-1)).toBe('scoped')
  })

  it('keeps the keyPrefix name when only that is set', () => {
    renderWith({ keyPrefix: 'legacy' })

    expect(namePrefixes.at(-1)).toBe('legacy')
  })
})
