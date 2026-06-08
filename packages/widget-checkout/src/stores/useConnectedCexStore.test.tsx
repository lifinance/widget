// @vitest-environment happy-dom
// The store lives in @lifi/widget-provider/checkout, but the test runner lives
// here (its primary consumer), so we exercise the public export from here.
import {
  type ConnectedCexAccount,
  connectedCexKey,
  useConnectedCexAccounts,
  useConnectedCexStore,
} from '@lifi/widget-provider/checkout'
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

const KEY = connectedCexKey('lifi-int', 'user-1')

function account(
  overrides: Partial<ConnectedCexAccount> = {}
): ConnectedCexAccount {
  const now = Date.now()
  return {
    accountId: 'acc-1',
    accountName: 'me@coinbase.com',
    accessToken: 'tok',
    brokerType: 'coinbase',
    brokerName: 'Coinbase',
    connectedAt: now,
    expiresAt: now + 60_000,
    ...overrides,
  }
}

function resetStore(): void {
  useConnectedCexStore.setState({ records: {} })
}

describe('useConnectedCexStore', () => {
  beforeEach(resetStore)
  afterEach(resetStore)

  it('writes accounts under the composite key', () => {
    act(() => {
      useConnectedCexStore.getState().addConnectedAccounts(KEY, [account()])
    })
    expect(useConnectedCexStore.getState().records[KEY]).toHaveLength(1)
  })

  it('de-dupes by accountId, keeping the newest write', () => {
    act(() => {
      const add = useConnectedCexStore.getState().addConnectedAccounts
      add(KEY, [account({ accessToken: 'old' })])
      add(KEY, [account({ accessToken: 'new' })])
    })
    const list = useConnectedCexStore.getState().records[KEY]
    expect(list).toHaveLength(1)
    expect(list[0].accessToken).toBe('new')
  })

  it('sweeps expired accounts on write', () => {
    const past = Date.now() - 1000
    act(() => {
      const add = useConnectedCexStore.getState().addConnectedAccounts
      add(KEY, [account({ accountId: 'stale', expiresAt: past })])
      add(KEY, [account({ accountId: 'fresh' })])
    })
    const list = useConnectedCexStore.getState().records[KEY]
    expect(list).toHaveLength(1)
    expect(list[0].accountId).toBe('fresh')
  })

  it('removeAccount drops one and clears the key when empty', () => {
    act(() => {
      useConnectedCexStore
        .getState()
        .addConnectedAccounts(KEY, [account({ accountId: 'acc-1' })])
      useConnectedCexStore.getState().removeAccount(KEY, 'acc-1')
    })
    expect(useConnectedCexStore.getState().records[KEY]).toBeUndefined()
  })

  it('useConnectedCexAccounts returns only live accounts', () => {
    act(() => {
      useConnectedCexStore
        .getState()
        .addConnectedAccounts(KEY, [account({ accountId: 'live' })])
    })
    const { result } = renderHook(() => useConnectedCexAccounts(KEY))
    expect(result.current).toHaveLength(1)
    expect(result.current.every((a) => a.expiresAt > Date.now())).toBe(true)
  })

  it('useConnectedCexAccounts returns a stable empty array for a null key', () => {
    const { result, rerender } = renderHook(() => useConnectedCexAccounts(null))
    const first = result.current
    rerender()
    expect(result.current).toBe(first)
    expect(result.current).toHaveLength(0)
  })
})
