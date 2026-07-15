import { useSettingsStoreContext } from '@lifi/widget/shared'
import { useCallback } from 'react'

interface ExchangesSnapshot {
  enabledExchanges: string[]
  _enabledExchanges: Record<string, boolean>
  disabledExchanges: string[]
}

// Pristine pre-override settings per store instance; the store is persisted
// and merge-seeded, so restoring must not re-seed from config.
const snapshots = new WeakMap<object, ExchangesSnapshot>()

/**
 * Synchronously forces the settings store's `enabledExchanges` to a specific
 * allow-list. Required for the IF-only checkout flows (transfer, exchange,
 * cash) so `useRoutes` sends the IF-only `exchanges.allow` on the very first
 * fetch instead of the seeded full /v1/tools list. `restoreExchanges` puts
 * the pre-override settings back for the wallet flow.
 */
export function useCheckoutExchangesOverride(): {
  overrideExchanges: (allow: string[]) => void
  restoreExchanges: () => void
} {
  const settingsStore = useSettingsStoreContext()

  const overrideExchanges = useCallback(
    (allow: string[]) => {
      if (!snapshots.has(settingsStore)) {
        const state = settingsStore.getState()
        snapshots.set(settingsStore, {
          enabledExchanges: [...state.enabledExchanges],
          _enabledExchanges: { ...state._enabledExchanges },
          disabledExchanges: [...state.disabledExchanges],
        })
      }
      settingsStore.setState({
        enabledExchanges: allow,
        _enabledExchanges: Object.fromEntries(allow.map((k) => [k, true])),
        disabledExchanges: [],
      })
    },
    [settingsStore]
  )

  const restoreExchanges = useCallback(() => {
    const snapshot = snapshots.get(settingsStore)
    if (snapshot) {
      snapshots.delete(settingsStore)
      settingsStore.setState(snapshot)
      return
    }
    // Reload mid-flow: no snapshot, so strip the IF-only keys instead.
    const state = settingsStore.getState()
    if (!INTENT_FACTORY_ONLY.some((key) => key in state._enabledExchanges)) {
      return
    }
    const _enabledExchanges: Record<string, boolean> = {
      ...state._enabledExchanges,
    }
    for (const key of INTENT_FACTORY_ONLY) {
      delete _enabledExchanges[key]
    }
    settingsStore.setState({
      _enabledExchanges,
      enabledExchanges: Object.keys(_enabledExchanges).filter(
        (key) => _enabledExchanges[key]
      ),
    })
  }, [settingsStore])

  return { overrideExchanges, restoreExchanges }
}

export const INTENT_FACTORY_ONLY: readonly string[] = ['smartDeposits']
