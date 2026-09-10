import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { WidgetProvider } from '../../providers/WidgetProvider/WidgetProvider.js'
import type { WidgetConfig } from '../../types/widget.js'
import {
  createSettingsStore,
  defaultConfigurableSettings,
  getDefaultConfigurableSettings,
} from './createSettingsStore.js'
import { SettingsStoreProvider } from './SettingsStore.js'

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

const renderWidget = (config: WidgetConfig) =>
  renderToString(
    <SettingsStoreProvider config={config}>
      <WidgetProvider config={config}>
        <span />
      </WidgetProvider>
    </SettingsStoreProvider>
  )

describe('widget configurable defaults', () => {
  const originalLocalStorageDescriptor = Object.getOwnPropertyDescriptor(
    globalThis,
    'localStorage'
  )

  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: createLocalStorageMock(),
      configurable: true,
      writable: true,
    })
    defaultConfigurableSettings.slippage = undefined
    defaultConfigurableSettings.routePriority = 'CHEAPEST'
    defaultConfigurableSettings.gasPrice = 'normal'
  })

  afterEach(() => {
    if (originalLocalStorageDescriptor) {
      Object.defineProperty(
        globalThis,
        'localStorage',
        originalLocalStorageDescriptor
      )
    } else {
      Reflect.deleteProperty(globalThis, 'localStorage')
    }
  })

  it('does not mutate defaults shared by other widget instances', () => {
    renderWidget({
      integrator: 'first-widget',
      slippage: 0.01,
      routePriority: 'FASTEST',
    })

    expect(defaultConfigurableSettings.slippage).toBeUndefined()
    expect(defaultConfigurableSettings.routePriority).toBe('CHEAPEST')
  })

  it('keeps configurable defaults isolated between settings stores', () => {
    const firstStore = createSettingsStore({
      integrator: 'first-widget',
      slippage: 0.01,
      routePriority: 'FASTEST',
    })
    globalThis.localStorage.clear()
    const secondStore = createSettingsStore({
      integrator: 'second-widget',
    })

    expect(firstStore.getState().slippage).toBe('1')
    expect(firstStore.getState().routePriority).toBe('FASTEST')
    expect(secondStore.getState().slippage).toBeUndefined()
    expect(secondStore.getState().routePriority).toBe('CHEAPEST')
  })

  it('resets with defaults from the current widget config', () => {
    const store = createSettingsStore({
      integrator: 'widget',
    })

    store.getState().reset(
      [],
      [],
      getDefaultConfigurableSettings({
        integrator: 'widget',
        slippage: 0.02,
        routePriority: 'FASTEST',
      })
    )

    expect(store.getState().slippage).toBe('2')
    expect(store.getState().routePriority).toBe('FASTEST')
  })
})
