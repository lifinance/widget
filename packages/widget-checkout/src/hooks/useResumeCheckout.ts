'use client'
import { isRouteDone, useRouteExecutionStoreContext } from '@lifi/widget/shared'
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
  const routeStore = useRouteExecutionStoreContext()

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
      // Any unfinished wallet route (in flight, or failed and awaiting retry)
      // resumes on the execution page. Re-seed from the 24h snapshot if it was
      // evicted from the route store so resumeRoute can re-attach.
      let routeResumable = false
      if (record.fundingSource === 'wallet' && record.frozenRouteId) {
        const state = routeStore.getState()
        let stored = state.routes[record.frozenRouteId]?.route
        if (!stored && record.frozenQuote?.route) {
          state.setExecutableRoute(record.frozenQuote.route)
          stored = routeStore.getState().routes[record.frozenRouteId]?.route
        }
        routeResumable = !!stored && !isRouteDone(stored)
      }
      const nav = buildResumeNavigation(record, {
        frozenQuoteFresh,
        depositDetected,
        routeResumable,
      })
      navigate({ to: nav.to, search: nav.search })
    },
    [navigate, flowStore, seedFrozenQuote, routeStore]
  )
}
