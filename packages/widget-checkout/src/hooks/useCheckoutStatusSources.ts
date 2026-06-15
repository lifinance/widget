'use client'
import type { Route } from '@lifi/sdk'
import { useMemo } from 'react'
import { useCheckoutToAddress } from './useCheckoutToAddress.js'
import { useFrozenQuote } from './useFrozenQuote.js'
import { useResumeRecord } from './useResumeKey.js'

export interface CheckoutStatusSources {
  frozenRoute: Route | undefined
  recipientAddress: string | null
}

// The status API reports the solver's addresses for intent/deposit flows, and
// the deposit-address poll is too sparse to render the pending page. Both are
// recovered from the locally-known quote: the in-memory frozen quote, falling
// back to the persisted pending record so it survives a reload mid-flow.
export function useCheckoutStatusSources(): CheckoutStatusSources {
  const configuredToAddress = useCheckoutToAddress()
  const { frozen } = useFrozenQuote()
  const resumeRecord = useResumeRecord()

  const frozenRoute = frozen?.route ?? resumeRecord?.frozenQuote?.route

  // Frozen route's toAddress is only a fallback for resumed flows where config is absent.
  const recipientAddress = useMemo<string | null>(
    () => configuredToAddress ?? frozenRoute?.toAddress ?? null,
    [configuredToAddress, frozenRoute]
  )

  return { frozenRoute, recipientAddress }
}
