import {
  createContext,
  type JSX,
  type PropsWithChildren,
  useContext,
  useRef,
} from 'react'
import type { StoreApi, UseBoundStore } from 'zustand'
import { create } from 'zustand'

export type FiatCurrency = 'USD' | 'EUR' | 'GBP'

export const FIAT_CURRENCIES: readonly FiatCurrency[] = ['USD', 'EUR', 'GBP']

export interface FiatCurrencyState {
  currency: FiatCurrency
  setCurrency: (currency: FiatCurrency) => void
}

type FiatCurrencyStore = UseBoundStore<StoreApi<FiatCurrencyState>>

export function createFiatCurrencyStore(): FiatCurrencyStore {
  return create<FiatCurrencyState>((set) => ({
    currency: 'USD',
    setCurrency: (currency) => set({ currency }),
  }))
}

const FiatCurrencyStoreContext = createContext<FiatCurrencyStore | null>(null)

export function FiatCurrencyStoreProvider({
  children,
}: PropsWithChildren): JSX.Element {
  const storeRef = useRef<FiatCurrencyStore>(null)
  if (!storeRef.current) {
    storeRef.current = createFiatCurrencyStore()
  }
  return (
    <FiatCurrencyStoreContext.Provider value={storeRef.current}>
      {children}
    </FiatCurrencyStoreContext.Provider>
  )
}

export function useFiatCurrencyStore<T>(
  selector: (state: FiatCurrencyState) => T
): T {
  const store = useContext(FiatCurrencyStoreContext)
  if (!store) {
    throw new Error(
      'useFiatCurrencyStore must be used within FiatCurrencyStoreProvider'
    )
  }
  return store(selector)
}
