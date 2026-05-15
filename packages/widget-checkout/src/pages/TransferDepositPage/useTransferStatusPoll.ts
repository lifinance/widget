import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import {
  type CheckoutNavigationRoute,
  checkoutNavigationRoutes,
} from '../../utils/navigationRoutes.js'
import { getTransferReceiptSimulation } from '../../utils/transactionStatusSimulation.js'

export interface UseTransferStatusPollArgs {
  depositAddress: string | null
  routeId: string | null
  enabled: boolean
}

const statusPath =
  `/${checkoutNavigationRoutes.transactionExecution}/${checkoutNavigationRoutes.transactionStatus}` as `/${CheckoutNavigationRoute}/${CheckoutNavigationRoute}`

/**
 * Stub: polls every 5 s. Replace the body with a real `/v1/status` call once
 * CORE-203 ships and the IF substatus contract is final.
 *
 * Dev-only: when `?simulateTransferReceipt=done|pending|failed` is present,
 * skips polling and navigates to the status page after the configured delay
 * so the deposit flow can be walked end-to-end without a real transfer.
 */
export function useTransferStatusPoll({
  depositAddress,
  routeId,
  enabled,
}: UseTransferStatusPollArgs): void {
  const navigate = useNavigate()

  useEffect(() => {
    if (!enabled || !depositAddress || !routeId) {
      return
    }
    const sim = getTransferReceiptSimulation()
    if (sim) {
      const id = setTimeout(() => {
        navigate({
          to: statusPath,
          search: { simulateTransactionStatus: sim.kind },
        })
      }, sim.delayMs)
      return () => clearTimeout(id)
    }
    const id = setInterval(() => {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[checkout] mocked transfer status poll', {
          depositAddress,
          routeId,
        })
      }
    }, 5000)
    return () => clearInterval(id)
  }, [enabled, depositAddress, routeId, navigate])
}
