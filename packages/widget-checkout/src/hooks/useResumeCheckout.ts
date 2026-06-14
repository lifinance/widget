'use client'
import { useNavigate } from '@tanstack/react-router'
import { useCallback, useContext } from 'react'
import { CheckoutFlowStoreContext } from '../stores/useCheckoutFlowStore.js'
import type { PendingRecord } from '../stores/usePendingCheckoutStore.js'
import { buildResumeNavigation } from '../utils/buildResumeNavigation.js'
import { useSeedFrozenQuote } from './useFrozenQuote.js'

export function useResumeCheckout(): (
  record: PendingRecord,
  depositDetected?: boolean
) => void {
  const navigate = useNavigate()
  const flowStore = useContext(CheckoutFlowStoreContext)
  const seedFrozenQuote = useSeedFrozenQuote()

  return useCallback(
    (record: PendingRecord, depositDetected?: boolean) => {
      flowStore?.setState({
        fundingSource: record.fundingSource,
        frozenRouteId: record.frozenRouteId ?? null,
        frozenDepositId: record.depositId ?? null,
      })
      const frozenQuoteFresh =
        !!record.frozenQuote && record.frozenQuote.expiresAt > Date.now()
      if (frozenQuoteFresh && record.frozenQuote) {
        seedFrozenQuote({
          id: record.frozenQuote.id,
          route: record.frozenQuote.route,
          expiresAt: record.frozenQuote.expiresAt,
        })
      }
      const nav = buildResumeNavigation(record, {
        frozenQuoteFresh,
        depositDetected,
      })
      navigate({ to: nav.to, search: nav.search })
    },
    [navigate, flowStore, seedFrozenQuote]
  )
}
