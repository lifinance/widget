import { useSettingsStoreContext } from '@lifi/widget/shared'
import { useCallback } from 'react'

/**
 * Synchronously forces the settings store's `enabledExchanges` to a specific
 * allow-list. Required for the IF-only checkout flows (transfer, exchange,
 * cash) so `useRoutes` sends `exchanges.allow=['intentFactory']` on the very
 * first fetch instead of the seeded full /v1/tools list.
 */
export function useCheckoutExchangesOverride(): (allow: string[]) => void {
  const settingsStore = useSettingsStoreContext()
  return useCallback(
    (allow: string[]) => {
      settingsStore.setState({
        enabledExchanges: allow,
        _enabledExchanges: Object.fromEntries(allow.map((k) => [k, true])),
        disabledExchanges: [],
      })
    },
    [settingsStore]
  )
}

export const INTENT_FACTORY_ONLY: readonly string[] = ['intentFactory']
