'use client'
import type { Route } from '@lifi/sdk'
import { useMemo } from 'react'
import { useCheckoutToAddress } from './useCheckoutToAddress.js'
import { useFrozenQuote } from './useFrozenQuote.js'

export interface FiatOrigin {
  currency: string
  amount: string
}

export interface CheckoutStatusSources {
  frozenRoute: Route | undefined
  recipientAddress: string | null
  fiatOrigin: FiatOrigin | undefined
}

// The status API reports the solver's addresses for intent/deposit flows, and
// the deposit-address poll is too sparse to render the pending page. Both are
// recovered from the locally-known quote: the in-memory frozen quote from the
// current flow (a resumed flow reads its route straight off the funding order
// instead — see `orderStatusView.ts`).
export function useCheckoutStatusSources(): CheckoutStatusSources {
  const configuredToAddress = useCheckoutToAddress()
  const { frozen } = useFrozenQuote()

  const frozenRoute = frozen?.route

  // Frozen route's toAddress is only a fallback for resumed flows where config is absent.
  const recipientAddress = useMemo<string | null>(
    () => configuredToAddress ?? frozenRoute?.toAddress ?? null,
    [configuredToAddress, frozenRoute]
  )

  const fiatOrigin = useMemo<FiatOrigin | undefined>(() => {
    const currency = frozen?.fiatCurrency
    const amount = frozen?.fiatAmount
    if (!currency || !amount || !(Number.parseFloat(amount) > 0)) {
      return undefined
    }
    return { currency, amount }
  }, [frozen?.fiatCurrency, frozen?.fiatAmount])

  return { frozenRoute, recipientAddress, fiatOrigin }
}
