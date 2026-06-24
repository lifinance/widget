import { create } from 'zustand'
import {
  DEFAULT_VALID_UNTIL_SECONDS,
  type LimitOrderState,
  type LimitOrderStore,
} from './types.js'

const initialState = {
  limitPrice: '',
  priceInverted: false,
  validUntil: DEFAULT_VALID_UNTIL_SECONDS,
  partiallyFillable: true,
  selectedRouteId: undefined,
}

export const useLimitOrderStore: LimitOrderStore = create<LimitOrderState>(
  (set, get) => ({
    ...initialState,
    setLimitPrice: (limitPrice) => set({ limitPrice }),
    togglePriceDirection: () => set({ priceInverted: !get().priceInverted }),
    setValidUntil: (validUntil) => set({ validUntil }),
    setPartiallyFillable: (partiallyFillable) => set({ partiallyFillable }),
    setSelectedRouteId: (selectedRouteId) => set({ selectedRouteId }),
    reset: () => set({ ...initialState }),
  })
)
