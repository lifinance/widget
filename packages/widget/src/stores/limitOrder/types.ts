import type { StoreApi, UseBoundStore } from 'zustand'

/** Default order validity: 1 day, expressed as a duration in seconds. */
export const DEFAULT_VALID_UNTIL_SECONDS: number = 24 * 60 * 60

export interface LimitOrderState {
  /** User-entered limit price (receive token per send token, unless inverted). */
  limitPrice: string
  /** When true, the price is shown/entered as send token per receive token. */
  priceInverted: boolean
  /**
   * Order validity as a duration in seconds. Converted to an absolute
   * timestamp when the order request is built.
   */
  validUntil: number
  /** Whether the order may be partially filled. */
  partiallyFillable: boolean
  /**
   * Id of the route/provider quote the user picked. When unset (or no longer
   * present in the current results) the best route is treated as selected.
   */
  selectedRouteId?: string
  setLimitPrice: (limitPrice: string) => void
  togglePriceDirection: () => void
  setValidUntil: (seconds: number) => void
  setPartiallyFillable: (partiallyFillable: boolean) => void
  setSelectedRouteId: (selectedRouteId?: string) => void
  reset: () => void
}

export type LimitOrderStore = UseBoundStore<StoreApi<LimitOrderState>>
