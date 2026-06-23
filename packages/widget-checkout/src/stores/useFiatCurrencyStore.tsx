import {
  createContext,
  type JSX,
  type PropsWithChildren,
  useContext,
  useRef,
} from 'react'
import type { StoreApi, UseBoundStore } from 'zustand'
import { create } from 'zustand'

export type FiatCurrency = string

export const FIAT_CURRENCIES: readonly FiatCurrency[] = ['USD', 'EUR', 'GBP']

export interface FiatCurrencyState {
  currency: FiatCurrency
  paymentMethod: string | null
  currencyTouched: boolean
  setCurrency: (currency: FiatCurrency) => void
  setPaymentMethod: (paymentMethod: string | null) => void
  seedCurrency: (currency: FiatCurrency) => void
  reset: () => void
}

type FiatCurrencyStore = UseBoundStore<StoreApi<FiatCurrencyState>>

export function createFiatCurrencyStore(): FiatCurrencyStore {
  return create<FiatCurrencyState>((set) => ({
    currency: 'USD',
    paymentMethod: null,
    currencyTouched: false,
    setCurrency: (currency) =>
      set((state) =>
        state.currency === currency
          ? { currencyTouched: true }
          : { currency, paymentMethod: null, currencyTouched: true }
      ),
    setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
    seedCurrency: (currency) =>
      set((state) =>
        state.currencyTouched ? state : { currency, paymentMethod: null }
      ),
    reset: () =>
      set({
        currency: 'USD',
        paymentMethod: null,
        currencyTouched: false,
      }),
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
