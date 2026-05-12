import type { Route } from '@lifi/sdk'
import { useCallback, useEffect, useState } from 'react'
import type { StoreApi, UseBoundStore } from 'zustand'
import { create } from 'zustand'

export const FROZEN_QUOTE_TTL_MS: number = 30 * 60 * 1000

export interface FrozenQuote {
  id: string
  route: Route
  expiresAt: number
}

interface FrozenQuoteStore {
  frozen: FrozenQuote | null
  set: (frozen: FrozenQuote | null) => void
}

const useFrozenQuoteStore: UseBoundStore<StoreApi<FrozenQuoteStore>> =
  create<FrozenQuoteStore>((set) => ({
    frozen: null,
    set: (frozen) => set({ frozen }),
  }))

export interface UseFrozenQuote {
  frozen: FrozenQuote | null
  expired: boolean
  freeze: (route: Route) => void
  clear: () => void
}

export function useFrozenQuote(): UseFrozenQuote {
  const frozen = useFrozenQuoteStore((s) => s.frozen)
  const setFrozen = useFrozenQuoteStore((s) => s.set)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!frozen) {
      return
    }
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [frozen])

  const expired = !!frozen && now >= frozen.expiresAt

  const freeze = useCallback(
    (route: Route) => {
      setFrozen({
        id: route.id,
        route,
        expiresAt: Date.now() + FROZEN_QUOTE_TTL_MS,
      })
      setNow(Date.now())
    },
    [setFrozen]
  )

  const clear = useCallback(() => setFrozen(null), [setFrozen])

  return { frozen, expired, freeze, clear }
}
