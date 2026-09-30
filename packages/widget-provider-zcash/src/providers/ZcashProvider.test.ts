import { ChainId, type SDKProvider } from '@lifi/sdk'
import type { WidgetProviderContext } from '@lifi/widget-provider'
import type { ReactElement } from 'react'
import { describe, expect, it } from 'vitest'
import { ZcashProvider } from './ZcashProvider.js'

const t1 = 't1VmmGiyjVNeCjxDZzg7vZmd99WyzVby9yC'

// The component uses no hooks, so rendering it once yields the context element.
const contextValue = (
  provider: ReturnType<typeof ZcashProvider>
): WidgetProviderContext =>
  (
    provider({ chains: [], children: null }) as ReactElement<{
      value: WidgetProviderContext
    }>
  ).props.value

describe('ZcashProvider', () => {
  it('provides an enabled context that validates Zcash receivers', () => {
    const value = contextValue(ZcashProvider())

    expect(value.isEnabled).toBe(true)
    expect(value.isConnected).toBe(false)
    expect(value.installedWallets).toEqual([])
    expect(value.sdkProvider?.chainIds).toEqual([ChainId.ZEC])
    expect(value.sdkProvider?.isAddress(t1, ChainId.ZEC)).toBe(true)
  })

  it('uses a configured SDK provider', () => {
    const sdkProvider = { chainIds: [ChainId.ZEC] } as unknown as SDKProvider

    expect(contextValue(ZcashProvider({ sdkProvider })).sdkProvider).toBe(
      sdkProvider
    )
  })
})
