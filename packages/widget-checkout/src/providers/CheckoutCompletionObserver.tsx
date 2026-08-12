'use client'
import type { FundingOrder } from '@lifi/sdk'
import { useCheckoutActivity } from '../hooks/useCheckoutActivity.js'
import { useFundingOrderCompletion } from '../hooks/useFundingOrderCompletion.js'
import type { CheckoutFundingSource } from '../stores/useCheckoutFlowStore.js'

function OrderCompletionWatcher({
  order,
  fundingSource,
}: {
  order: FundingOrder | undefined
  fundingSource: CheckoutFundingSource
}): null {
  useFundingOrderCompletion(order, fundingSource)
  return null
}

/**
 * Fires `onSuccess`/`onError` for every tracked order, not just the one the
 * status page happens to be showing — the wallet flow completes on
 * `/transaction-execution` and never mounts that page. Sits above the router
 * so it survives navigation; `useFundingOrderCompletion` dedupes per orderId
 * across mounts, so the status page can keep its own call.
 */
export function CheckoutCompletionObserver(): React.ReactNode {
  const items = useCheckoutActivity()
  return items.map((item) => (
    <OrderCompletionWatcher
      key={item.orderId}
      order={item.order}
      fundingSource={item.fundingSource}
    />
  ))
}
