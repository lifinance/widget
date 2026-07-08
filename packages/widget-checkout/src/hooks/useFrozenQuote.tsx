import type { Route } from '@lifi/sdk'
import {
  type Context,
  createContext,
  type JSX,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { StoreApi, UseBoundStore } from 'zustand'
import { create } from 'zustand'

export const FROZEN_QUOTE_TTL_MS: number = 30 * 60 * 1000

export interface FrozenQuote {
  id: string
  route: Route
  expiresAt: number
  fiatCurrency?: string
  fiatAmount?: string
}

export interface FrozenQuoteMeta {
  fiatCurrency?: string
  fiatAmount?: string
}

interface FrozenQuoteState {
  frozen: FrozenQuote | null
  set: (frozen: FrozenQuote | null) => void
}

type FrozenQuoteStore = UseBoundStore<StoreApi<FrozenQuoteState>>

function createFrozenQuoteStore(): FrozenQuoteStore {
  return create<FrozenQuoteState>((set) => ({
    frozen: null,
    set: (frozen) => set({ frozen }),
  }))
}

export const FrozenQuoteStoreContext: Context<FrozenQuoteStore | null> =
  createContext<FrozenQuoteStore | null>(null)

export function FrozenQuoteStoreProvider({
  children,
}: PropsWithChildren): JSX.Element {
  const storeRef = useRef<FrozenQuoteStore>(null)
  if (!storeRef.current) {
    storeRef.current = createFrozenQuoteStore()
  }
  return (
    <FrozenQuoteStoreContext.Provider value={storeRef.current}>
      {children}
    </FrozenQuoteStoreContext.Provider>
  )
}

function useFrozenQuoteStore<T>(selector: (state: FrozenQuoteState) => T): T {
  const store = useContext(FrozenQuoteStoreContext)
  if (!store) {
    throw new Error(
      'useFrozenQuote must be used within FrozenQuoteStoreProvider'
    )
  }
  return store(selector)
}

export interface UseFrozenQuote {
  frozen: FrozenQuote | null
  expired: boolean
  /** Milliseconds until the frozen quote expires (0 once expired/unset). */
  remainingMs: number
  freeze: (route: Route, meta?: FrozenQuoteMeta) => void
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
  const remainingMs = frozen ? Math.max(0, frozen.expiresAt - now) : 0

  const freeze = useCallback(
    (route: Route, meta?: FrozenQuoteMeta) => {
      setFrozen({
        id: route.id,
        route,
        expiresAt: Date.now() + FROZEN_QUOTE_TTL_MS,
        fiatCurrency: meta?.fiatCurrency,
        fiatAmount: meta?.fiatAmount,
      })
      setNow(Date.now())
    },
    [setFrozen]
  )

  const clear = useCallback(() => setFrozen(null), [setFrozen])

  return { frozen, expired, remainingMs, freeze, clear }
}

export function useSeedFrozenQuote(): (frozen: FrozenQuote) => void {
  const store = useContext(FrozenQuoteStoreContext)
  if (!store) {
    throw new Error(
      'useSeedFrozenQuote must be used within FrozenQuoteStoreProvider'
    )
  }
  return useCallback(
    (frozen) => {
      store.setState({ frozen })
    },
    [store]
  )
}
