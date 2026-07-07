import type { Route, RouteOptions } from '@lifi/sdk'
import { getRoutes, parseUnits } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import {
  useChain,
  useFieldValues,
  useRoutes,
  useSDKClient,
  useSettingsStoreContext,
  useToken,
  useWidgetConfig,
} from '@lifi/widget/shared'
import { useQuery } from '@tanstack/react-query'

type UseRoutesResult = ReturnType<typeof useRoutes>

/**
 * Checkout route source. Walletless funding (cash/transfer/exchange) has no
 * `fromAddress`, so it quotes via a direct `getRoutes` using the destination
 * address as placeholder. A connected wallet uses the shared `useRoutes` as-is.
 */
export function useCheckoutRoutes(): UseRoutesResult {
  const base = useRoutes()
  const sdkClient = useSDKClient()
  const { exchanges, bridges, feeConfig } = useWidgetConfig()
  const [
    fromChainId,
    fromTokenAddress,
    fromAmount,
    toChainId,
    toTokenAddress,
    toAddress,
  ] = useFieldValues(
    'fromChain',
    'fromToken',
    'fromAmount',
    'toChain',
    'toToken',
    'toAddress'
  )
  const { chain: fromChain } = useChain(fromChainId)
  const { token: fromToken } = useToken(fromChainId, fromTokenAddress)
  const { token: toToken } = useToken(toChainId, toTokenAddress)
  const { account } = useAccount({ chainType: fromChain?.chainType })
  const useSettingsStore = useSettingsStoreContext()
  const slippage: string | undefined = useSettingsStore(
    (state: { slippage?: string }) => state.slippage
  )
  const routePriority: RouteOptions['order'] = useSettingsStore(
    (state: { routePriority?: RouteOptions['order'] }) => state.routePriority
  )

  const hasWallet = Boolean(account.address)
  const amountNumber = Number(fromAmount)
  const hasAmount = Number.isFinite(amountNumber) && amountNumber > 0

  const fromAmountRaw =
    fromToken && hasAmount
      ? parseUnits(String(fromAmount), fromToken.decimals).toString()
      : undefined
  const formattedSlippage = slippage ? Number.parseFloat(slippage) : undefined

  // A destination is required walletless — it doubles as the from-address placeholder.
  const fallbackEnabled =
    !hasWallet &&
    Boolean(
      toAddress &&
        fromAmountRaw &&
        fromChainId &&
        fromToken?.address &&
        toChainId &&
        toToken?.address
    )

  const fallback = useQuery<Route[]>({
    queryKey: [
      'checkout-deposit-routes',
      toAddress,
      fromChainId,
      fromToken?.address,
      fromAmountRaw,
      toChainId,
      toToken?.address,
      formattedSlippage,
      routePriority,
      exchanges?.allow,
      bridges?.allow,
    ],
    enabled: fallbackEnabled,
    queryFn: async ({ signal }) => {
      const result = await getRoutes(
        sdkClient,
        {
          fromAddress: toAddress as string,
          fromAmount: fromAmountRaw as string,
          fromChainId: fromChainId as number,
          fromTokenAddress: fromToken?.address as string,
          toAddress: toAddress as string,
          toChainId: toChainId as number,
          toTokenAddress: toToken?.address as string,
          options: {
            order: routePriority,
            slippage: formattedSlippage,
            bridges: bridges?.allow?.length
              ? { allow: bridges.allow }
              : undefined,
            exchanges: exchanges?.allow?.length
              ? { allow: exchanges.allow }
              : undefined,
            fee: feeConfig?.fee,
            executionType: 'all',
          },
        },
        { signal }
      )
      return result.routes
    },
    refetchInterval: base.refetchTime,
    staleTime: base.refetchTime,
  })

  if (hasWallet || (base.routes && base.routes.length > 0)) {
    return base
  }

  return {
    ...base,
    routes: fallback.data,
    isLoading: fallbackEnabled && fallback.isLoading,
    isFetching: fallback.isFetching,
    isFetched: fallback.isFetched,
    dataUpdatedAt: fallback.dataUpdatedAt,
    refetch: () => {
      fallback.refetch()
    },
  }
}
