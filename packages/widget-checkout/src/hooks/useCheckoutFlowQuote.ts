import type { LiFiStep, Route } from '@lifi/sdk'
import { getStepTransaction } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import { useRoutes, useSDKClient, useWidgetConfig } from '@lifi/widget/shared'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { extractDepositAddress } from '../utils/extractDepositAddress.js'

export interface CheckoutFlowQuote {
  route: Route | undefined
  routes: Route[] | undefined
  depositAddress: string | null
  isLoading: boolean
  isFetching: boolean
  isFetched: boolean
  refetch: () => void
  setReviewableRoute: (route: Route) => void
  resolvedToAddress: string | null
}

export function useCheckoutFlowQuote(): CheckoutFlowQuote {
  const { accounts } = useAccount()
  const widgetConfig = useWidgetConfig()
  const sdkClient = useSDKClient()

  const resolvedToAddress = useMemo<string | null>(() => {
    const connected = accounts.find((a) => a.isConnected && a.address)?.address
    if (connected) {
      return connected
    }
    const configured = widgetConfig.toAddress
    if (!configured) {
      return null
    }
    return typeof configured === 'string' ? configured : configured.address
  }, [accounts, widgetConfig.toAddress])

  const {
    routes,
    isLoading: routesLoading,
    isFetching: routesFetching,
    isFetched: routesFetched,
    refetch,
    setReviewableRoute,
  } = useRoutes()

  const rawRoute = routes?.[0]
  const firstStep = rawRoute?.steps?.[0]

  const {
    data: populatedStep,
    isLoading: stepLoading,
    isFetching: stepFetching,
    isFetched: stepFetched,
  } = useQuery<LiFiStep | undefined>({
    queryKey: [
      'checkout-step-transaction',
      firstStep?.id,
      firstStep?.action.fromAmount,
      firstStep?.action.fromAddress,
      firstStep?.action.toAddress,
    ],
    queryFn: ({ signal }) =>
      firstStep
        ? getStepTransaction(sdkClient, firstStep, { signal })
        : Promise.resolve(undefined),
    enabled: Boolean(firstStep),
    staleTime: 5 * 60 * 1000,
  })

  const route = useMemo<Route | undefined>(() => {
    if (!rawRoute) {
      return undefined
    }
    if (!populatedStep) {
      return rawRoute
    }
    return {
      ...rawRoute,
      steps: [populatedStep, ...rawRoute.steps.slice(1)],
    }
  }, [rawRoute, populatedStep])

  return {
    route,
    routes,
    depositAddress: extractDepositAddress(route),
    isLoading: routesLoading || (Boolean(rawRoute) && stepLoading),
    isFetching: routesFetching || (Boolean(rawRoute) && stepFetching),
    isFetched: routesFetched && (!rawRoute || stepFetched),
    refetch,
    setReviewableRoute,
    resolvedToAddress,
  }
}
