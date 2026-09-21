/** @vitest-environment happy-dom */

import type { ExtendedChain } from '@lifi/sdk'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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

const chain = (id: number): ExtendedChain =>
  ({ id, name: `Chain ${id}`, chainType: 'EVM' }) as unknown as ExtendedChain

let chainsConfig: { from?: number[] } | undefined
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
  formValues.delete(`${key}Chain`)
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
  root = createRoot(document.createElement('div'))
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

    // The tab cannot be shown with one chain, so this side needs a fallback.
    chainsConfig = { from: [ARBITRUM] }
    availableChains = [chain(ARBITRUM)]
    setFieldValue.mockClear()
    render()

    expect(fromIsAllNetworks).toBe(false)
    expect(fromChainWrites()).toHaveLength(1)
    expect(fromChainWrites()[0][1]).toBe(ARBITRUM)
  })
})
