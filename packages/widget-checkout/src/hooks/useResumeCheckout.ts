'use client'
import { useNavigate } from '@tanstack/react-router'
import { useCallback, useContext } from 'react'
import { CheckoutFlowStoreContext } from '../stores/useCheckoutFlowStore.js'
import { checkoutNavigationRoutes } from '../utils/navigationRoutes.js'
import type { ActivityItem } from './useCheckoutActivity.js'

const statusPath = `/${checkoutNavigationRoutes.transactionExecution}/${checkoutNavigationRoutes.transactionStatus}`

export function useResumeCheckout(): (item: ActivityItem) => void {
  const navigate = useNavigate()
  const flowStore = useContext(CheckoutFlowStoreContext)

  return useCallback(
    (item: ActivityItem) => {
      flowStore?.setState({ fundingSource: item.fundingSource })
      // A still-open transfer reopens the QR/deposit-address page; the order
      // tracks every other flow's server-side state, so those all resume on
      // the status route — including wallet, where re-attaching an unsent
      // local route is out of scope (the SDK re-fetches the committed quote,
      // and an unsent order surfaces as `watching` with its own retry path).
      if (
        item.fundingSource === 'transfer' &&
        item.order?.substatus === 'INTENT_AWAITING_FUNDS'
      ) {
        navigate({
          to: checkoutNavigationRoutes.transferDeposit,
          search: { orderId: item.orderId },
        })
        return
      }
      navigate({ to: statusPath, search: { orderId: item.orderId } })
    },
    [navigate, flowStore]
  )
}
