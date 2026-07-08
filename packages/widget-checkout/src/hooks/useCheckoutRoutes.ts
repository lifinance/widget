import { useChain, useFieldValues, useRoutes } from '@lifi/widget/shared'

type UseRoutesResult = ReturnType<typeof useRoutes>

/**
 * Checkout route source. Delegates to the shared `useRoutes`, supplying the
 * destination as a from-address placeholder so walletless funding
 * (cash/transfer/exchange) can be quoted before a wallet connects. The
 * placeholder is only valid when source and destination share an ecosystem.
 */
export function useCheckoutRoutes(): UseRoutesResult {
  const [toAddress, fromChainId, toChainId] = useFieldValues(
    'toAddress',
    'fromChain',
    'toChain'
  )
  const { chain: fromChain } = useChain(fromChainId)
  const { chain: toChain } = useChain(toChainId)

  const quoteFromAddress =
    toAddress &&
    fromChain?.chainType &&
    fromChain.chainType === toChain?.chainType
      ? (toAddress as string)
      : undefined

  // Keep the prior quote visible while a token/amount change refetches, so the
  // receive amount updates in place instead of flashing a skeleton/zero.
  return useRoutes({ quoteFromAddress, keepPreviousData: true })
}
