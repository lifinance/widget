'use client'
import { convertOrderToRoute } from '@lifi/sdk'
import { useRouteExecutionStoreContext } from '@lifi/widget/shared'
import { useNavigate } from '@tanstack/react-router'
import { useCallback, useContext } from 'react'
import { CheckoutFlowStoreContext } from '../stores/useCheckoutFlowStore.js'
import {
  checkoutAbsolutePaths,
  checkoutNavigationRoutes,
} from '../utils/navigationRoutes.js'
import { isAwaitingUserAction } from '../utils/orderStatusView.js'
import type { ActivityItem } from './useCheckoutActivity.js'

const statusPath = `/${checkoutNavigationRoutes.transactionExecution}/${checkoutNavigationRoutes.transactionStatus}`

export function useResumeCheckout(): (item: ActivityItem) => void {
  const navigate = useNavigate()
  const flowStore = useContext(CheckoutFlowStoreContext)
  const routeExecutionStore = useRouteExecutionStoreContext()

  return useCallback(
    (item: ActivityItem) => {
      flowStore?.setState({ fundingSource: item.fundingSource })
      // A still-open transfer reopens the QR/deposit-address page.
      if (
        item.fundingSource === 'transfer' &&
        isAwaitingUserAction(item.order)
      ) {
        navigate({
          to: checkoutNavigationRoutes.transferDeposit,
          search: { orderId: item.orderId },
        })
        return
      }
      // A wallet order whose source transaction was never sent (a fresh
      // STANDARD order carries PENDING with no substatus) has nothing to watch:
      // the status route would show "Processing transaction" forever with no
      // retry. Re-seed the committed quote as an executable route the way the
      // wallet CTA does, so the review page can prompt for the payment again.
      const order = item.order
      if (
        item.fundingSource === 'wallet' &&
        order &&
        item.phase === 'pending' &&
        !order.result?.fromTxHash
      ) {
        try {
          const orderRoute = convertOrderToRoute(order)
          routeExecutionStore.getState().setExecutableRoute(orderRoute)
          navigate({
            to: checkoutAbsolutePaths.transactionExecution,
            search: { routeId: order.orderId },
          })
          return
        } catch {
          // No executable quote on the order — fall through to the status route.
        }
      }
      // The order tracks every other flow's server-side state, so those all
      // resume on the status route.
      navigate({ to: statusPath, search: { orderId: item.orderId } })
    },
    [navigate, flowStore, routeExecutionStore]
  )
}
