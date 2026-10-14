import { ChainId, type SDKProvider } from '@lifi/sdk'
import type { WidgetProviderContext } from '@lifi/widget-provider'
import type { ReactElement } from 'react'
import { describe, expect, it } from 'vitest'
import { ZcashProvider } from './ZcashProvider.js'

const t1 = 't1VmmGiyjVNeCjxDZzg7vZmd99WyzVby9yC'
const unified =
  'u1k9eh52jx5q4y8lw6x208lsep4t6yzwk7mdwz9e6239qywjkqzdcd3al3d64zwnqx296p3klxnash5w2e0elg39qrydxx0s0qz5m2gnt0'

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
    expect(value.sdkProvider?.isAddress(unified, ChainId.ZEC)).toBe(true)
  })

  it('uses a configured SDK provider', () => {
    const sdkProvider = { chainIds: [ChainId.ZEC] } as unknown as SDKProvider

    expect(contextValue(ZcashProvider({ sdkProvider })).sdkProvider).toBe(
      sdkProvider
    )
  })
})
