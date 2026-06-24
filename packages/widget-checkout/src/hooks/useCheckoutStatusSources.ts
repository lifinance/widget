'use client'
import type { Route } from '@lifi/sdk'
import { useMemo } from 'react'
import { useCheckoutToAddress } from './useCheckoutToAddress.js'
import { useFrozenQuote } from './useFrozenQuote.js'
import { useResumeRecord } from './useResumeKey.js'

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
// recovered from the locally-known quote: the in-memory frozen quote, falling
// back to the persisted pending record once a flow is re-entered from the
// activity list (which re-seeds frozenDepositId, the key useResumeRecord reads).
export function useCheckoutStatusSources(): CheckoutStatusSources {
  const configuredToAddress = useCheckoutToAddress()
  const { frozen } = useFrozenQuote()
  const resumeRecord = useResumeRecord()

  const frozenQuote = frozen ?? resumeRecord?.frozenQuote
  const frozenRoute = frozenQuote?.route

  // Frozen route's toAddress is only a fallback for resumed flows where config is absent.
  const recipientAddress = useMemo<string | null>(
    () => configuredToAddress ?? frozenRoute?.toAddress ?? null,
    [configuredToAddress, frozenRoute]
  )

  const fiatOrigin = useMemo<FiatOrigin | undefined>(() => {
    const currency = frozenQuote?.fiatCurrency
    const amount = frozenQuote?.fiatAmount
    if (!currency || !amount || !(Number.parseFloat(amount) > 0)) {
      return undefined
    }
    return { currency, amount }
  }, [frozenQuote?.fiatCurrency, frozenQuote?.fiatAmount])

  return { frozenRoute, recipientAddress, fiatOrigin }
}
