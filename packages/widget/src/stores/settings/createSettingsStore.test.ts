import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { WidgetConfig } from '../../types/widget.js'
import { createSettingsStore } from './createSettingsStore.js'

const STORAGE_KEY = 'li.fi-widget-settings'
// Must match the persist version in createSettingsStore, else merge tests
// silently become migration tests.
const STORE_VERSION = 6

const createLocalStorageMock = (): Storage => {
  let store: Record<string, string> = {}
  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store[key] = value
    },
    removeItem: (key) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    key: (index) => Object.keys(store)[index] ?? null,
    get length() {
      return Object.keys(store).length
    },
  }
}

const seedPersistedState = (state: Record<string, unknown>) => {
  globalThis.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ state, version: STORE_VERSION })
  )
}

describe('createSettingsStore tool allow-list', () => {
  let originalLocalStorage: Storage | undefined

  beforeEach(() => {
    originalLocalStorage = globalThis.localStorage
    globalThis.localStorage = createLocalStorageMock()
  })

  afterEach(() => {
    globalThis.localStorage = originalLocalStorage as Storage
  })

  it('seeds enabled tools from the config allow-list on a fresh store', () => {
    const store = createSettingsStore({
      exchanges: { allow: ['fly'] },
      bridges: { allow: ['across'] },
    } as WidgetConfig)

    const state = store.getState()
    expect(state.enabledExchanges).toEqual(['fly'])
    expect(state._enabledExchanges).toEqual({ fly: true })
    expect(state.enabledBridges).toEqual(['across'])
    expect(state._enabledBridges).toEqual({ across: true })
  })

  it('intersects a stale persisted allow-list with the current config', () => {
    seedPersistedState({
      _enabledExchanges: { fly: true, okx: true, kyber: true },
    })

    const store = createSettingsStore({
      exchanges: { allow: ['fly'] },
    } as WidgetConfig)

    const state = store.getState()
    expect(state.enabledExchanges).toEqual(['fly'])
    expect(state._enabledExchanges).toEqual({ fly: true })
    expect(state.disabledExchanges).toEqual([])
  })

  it('keeps the allow-list when the persisted map has no overlap', () => {
    seedPersistedState({
      _enabledExchanges: { okx: true, kyber: true },
    })

    const store = createSettingsStore({
      exchanges: { allow: ['fly'] },
    } as WidgetConfig)

    const state = store.getState()
    expect(state.enabledExchanges).toEqual(['fly'])
    expect(state._enabledExchanges).toEqual({ fly: true })
  })

  it('intersects a stale persisted bridges list with the current config', () => {
    seedPersistedState({
      _enabledBridges: { across: true, hop: true, stargate: true },
    })

    const store = createSettingsStore({
      bridges: { allow: ['across'] },
    } as WidgetConfig)

    const state = store.getState()
    expect(state.enabledBridges).toEqual(['across'])
    expect(state._enabledBridges).toEqual({ across: true })
  })

  it('does not restrict tools when the config has no allow-list', () => {
    const store = createSettingsStore({} as WidgetConfig)

    const state = store.getState()
    expect(state.enabledExchanges).toEqual([])
    expect(state.enabledBridges).toEqual([])
  })
})
