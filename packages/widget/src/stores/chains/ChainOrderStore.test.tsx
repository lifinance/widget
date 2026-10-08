/** @vitest-environment happy-dom */

import type { ExtendedChain } from '@lifi/sdk'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * Regression cover for JUM-1541.
 *
 * Mock identities must stay stable. In production this effect's dependencies
 * are config values, so it does not re-run when a form field changes; mocks
 * that rebuild objects each render would re-run it and prove behaviour the
 * widget does not have.
 */

const ETHEREUM = 1
const ARBITRUM = 42161
const POLYGON = 137
const SOLANA = 1151111081099710

const chain = (id: number): ExtendedChain =>
  ({ id, name: `Chain ${id}`, chainType: 'EVM' }) as unknown as ExtendedChain

let chainsConfig: { from?: { allow: number[] } } | undefined
let availableChains: ExtendedChain[] = []
let swapOnly = false
let fromChainConfig: number | undefined

const formValues = new Map<string, unknown>()
const touchedFields = new Set<string>()
const setFieldValue = vi.fn(
  (key: string, value: unknown, options?: { isTouched?: boolean }) => {
    formValues.set(key, value)
    if (options?.isTouched === true) {
      touchedFields.add(key)
    } else if (options?.isTouched === false) {
      touchedFields.delete(key)
    }
  }
)

vi.mock('../../hooks/useChains.js', () => ({
  useChains: () => ({ chains: availableChains }),
}))

vi.mock('../../hooks/useSwapOnly.js', () => ({
  useSwapOnly: () => swapOnly,
}))

// Stable identities, as production has them: `useExternalWalletProvider`
// memoizes and `useFieldActions` selects store methods through `useShallow`.
// Returning fresh objects here would put a new value in the effect's
// dependency array on every render and re-run it — which production does not
// do, and which would make these tests prove something the widget does not.
const externalWalletProvider = {
  externalChainTypes: [] as string[],
  useExternalWalletProvidersOnly: false,
}
vi.mock('../../providers/WalletProvider/useExternalWalletProvider.js', () => ({
  useExternalWalletProvider: () => externalWalletProvider,
}))

vi.mock('../../providers/WidgetProvider/WidgetProvider.js', () => ({
  useWidgetConfig: () => ({
    chains: chainsConfig,
    hiddenUI: undefined,
    fromChain: fromChainConfig,
    toChain: undefined,
    buildUrl: true,
    variant: 'compact',
  }),
}))

const getFieldValues = (key: string) => [formValues.get(key)]
const isTouched = (key: string) => touchedFields.has(key)
const fieldActions = { setFieldValue, getFieldValues, isTouched }
vi.mock('../form/useFieldActions.js', () => ({
  useFieldActions: () => fieldActions,
}))

const { ChainOrderStoreProvider, useChainOrderStore } = await import(
  './ChainOrderStore.js'
)

/** What `selectAllNetworks` does to the form: clear the field, as touched. */
const clickAllNetworks = (key: 'from' | 'to') => {
  formValues.set(`${key}Chain`, '')
  touchedFields.add(`${key}Chain`)
}

let fromIsAllNetworks: boolean | undefined

const StoreHandle = (): null => {
  fromIsAllNetworks = useChainOrderStore((state) => state.fromIsAllNetworks)
  return null
}

let root: Root

const render = () => {
  act(() => {
    root.render(
      <ChainOrderStoreProvider namePrefix="test">
        <StoreHandle />
      </ChainOrderStoreProvider>
    )
  })
}

const fromChainWrites = () =>
  setFieldValue.mock.calls.filter(([key]) => key === 'fromChain')

const toChainWrites = () =>
  setFieldValue.mock.calls.filter(([key]) => key === 'toChain')

/** An integrator that derives `chains` from form state rebuilds it on every write. */
const rebuildHostConfig = () => {
  chainsConfig = { ...chainsConfig }
  render()
}

beforeEach(() => {
  ;(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true
  window.history.replaceState({}, '', '/')
  window.localStorage.clear()
  formValues.clear()
  touchedFields.clear()
  setFieldValue.mockClear()
  chainsConfig = undefined
  swapOnly = false
  fromChainConfig = undefined
  availableChains = [chain(ETHEREUM), chain(ARBITRUM)]
  fromIsAllNetworks = undefined
  root = createRoot(document.createElement('div'))
})

afterEach(() => {
  act(() => root.unmount())
})

describe('ChainOrderStoreProvider', () => {
  it('starts on "All networks" when nothing names a chain', () => {
    render()

    expect(fromIsAllNetworks).toBe(true)
    expect(fromChainWrites()).toHaveLength(0)
  })

  it('starts off "All networks" when a deep link named a chain', () => {
    // How the widget learns this when the config carries nothing.
    window.history.replaceState({}, '', `/?fromChain=${ARBITRUM}`)
    formValues.set('fromChain', ARBITRUM)
    render()

    expect(fromIsAllNetworks).toBe(false)
    expect(fromChainWrites()).toHaveLength(0)
  })

  it('starts off "All networks" when the config names a chain', () => {
    fromChainConfig = POLYGON
    render()

    expect(fromIsAllNetworks).toBe(false)
  })

  it('does not put a chain back after the user chooses "All networks"', () => {
    // jumper-frontend seeds its config from the URL, so a deep link arrives
    // as a config chain as well as a form value and a query param.
    fromChainConfig = ARBITRUM
    formValues.set('fromChain', ARBITRUM)
    window.history.replaceState({}, '', `/?fromChain=${ARBITRUM}`)
    render()
    expect(fromIsAllNetworks).toBe(false)

    clickAllNetworks('from')
    setFieldValue.mockClear()

    // jumper-frontend rebuilds `chains` from form state, so clearing the
    // field re-runs the effect on that same commit — while the config and the
    // query string still name Arbitrum.
    chainsConfig = { ...chainsConfig }
    render()

    expect(fromIsAllNetworks).toBe(true)
    expect(fromChainWrites()).toHaveLength(0)
  })

  it('fills an empty chain when the "All networks" tab is withdrawn', () => {
    render()
    expect(fromChainWrites()).toHaveLength(0)

    // An allow-list of one chain withdraws the tab, so this side needs a
    // fallback.
    chainsConfig = { from: { allow: [ARBITRUM] } }
    setFieldValue.mockClear()
    render()

    expect(fromIsAllNetworks).toBe(false)
    expect(fromChainWrites()).toHaveLength(1)
    expect(fromChainWrites()[0][1]).toBe(ARBITRUM)
  })
})

describe('ChainOrderStoreProvider in swap-only modes', () => {
  beforeEach(() => {
    swapOnly = true
  })

  const pickSource = (chainId: number) => {
    window.history.replaceState({}, '', `/?fromChain=${chainId}`)
    formValues.set('fromChain', chainId)
  }

  // The destination used to flip on every host rebuild until React threw #185.
  it('does not alternate the destination while the source is on "All networks"', () => {
    const destinations: unknown[] = []
    render()
    destinations.push(formValues.get('toChain'))
    for (let rebuild = 0; rebuild < 4; rebuild++) {
      rebuildHostConfig()
      destinations.push(formValues.get('toChain'))
    }

    expect(fromIsAllNetworks).toBe(true)
    expect(destinations).toEqual(Array(5).fill(ETHEREUM))
    expect(toChainWrites()).toHaveLength(1)
  })

  it('fills an empty destination from the source, not from the chain order', () => {
    pickSource(ARBITRUM)
    render()

    expect(formValues.get('toChain')).toBe(ARBITRUM)
  })

  it('moves a stale destination onto the source', () => {
    pickSource(ARBITRUM)
    formValues.set('toChain', ETHEREUM)
    render()

    expect(formValues.get('toChain')).toBe(ARBITRUM)
  })

  it('stops writing the destination once it matches the source', () => {
    pickSource(ARBITRUM)
    render()
    expect(formValues.get('toChain')).toBe(ARBITRUM)
    setFieldValue.mockClear()

    rebuildHostConfig()
    rebuildHostConfig()

    expect(toChainWrites()).toHaveLength(0)
  })

  it('keeps the destination when the source goes back to "All networks"', () => {
    pickSource(ARBITRUM)
    render()
    expect(formValues.get('toChain')).toBe(ARBITRUM)
    clickAllNetworks('from')
    setFieldValue.mockClear()

    rebuildHostConfig()
    rebuildHostConfig()

    expect(formValues.get('toChain')).toBe(ARBITRUM)
    expect(toChainWrites()).toHaveLength(0)
  })

  it('treats a zero source as no source', () => {
    formValues.set('fromChain', 0)
    render()
    rebuildHostConfig()

    expect(formValues.get('toChain')).toBe(ETHEREUM)
    expect(toChainWrites()).toHaveLength(1)
  })

  // The list can shrink under a destination, e.g. when the integrator narrows `chains`.
  it('replaces a destination the chain list does not offer while there is no source', () => {
    swapOnly = false
    availableChains = [chain(ETHEREUM), chain(ARBITRUM), chain(SOLANA)]
    formValues.set('toChain', SOLANA)
    render()
    expect(formValues.get('toChain')).toBe(SOLANA)

    swapOnly = true
    availableChains = [chain(ETHEREUM), chain(ARBITRUM)]
    render()
    rebuildHostConfig()

    expect(formValues.get('toChain')).toBe(ETHEREUM)
    expect(toChainWrites()).toHaveLength(1)
  })
})
