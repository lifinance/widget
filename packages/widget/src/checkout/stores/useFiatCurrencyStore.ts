import type { StoreApi, UseBoundStore } from 'zustand'
import { create } from 'zustand'

export type FiatCurrency = 'USD' | 'EUR' | 'GBP'

export const FIAT_CURRENCIES: readonly FiatCurrency[] = ['USD', 'EUR', 'GBP']

interface FiatCurrencyState {
  currency: FiatCurrency
  setCurrency: (currency: FiatCurrency) => void
}

export const useFiatCurrencyStore: UseBoundStore<StoreApi<FiatCurrencyState>> =
  create<FiatCurrencyState>((set) => ({
    currency: 'USD',
    setCurrency: (currency) => set({ currency }),
  }))
