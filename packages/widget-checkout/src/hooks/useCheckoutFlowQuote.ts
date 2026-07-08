import type { LiFiStep, Route } from '@lifi/sdk'
import { getStepTransaction } from '@lifi/sdk'
import { useSDKClient } from '@lifi/widget/shared'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { extractDepositAddress } from '../utils/extractDepositAddress.js'
import { useCheckoutRoutes } from './useCheckoutRoutes.js'

export interface CheckoutFlowQuote {
  route: Route | undefined
  routes: Route[] | undefined
  depositAddress: string | null
  isLoading: boolean
  isFetching: boolean
  isFetched: boolean
  isError: boolean
  refetch: () => void
  setReviewableRoute: (route: Route) => void
}

export function useCheckoutFlowQuote(): CheckoutFlowQuote {
  const sdkClient = useSDKClient()

  const {
    routes,
    isLoading: routesLoading,
    isFetching: routesFetching,
    isFetched: routesFetched,
    isError: routesIsError,
    refetch,
    setReviewableRoute,
  } = useCheckoutRoutes()

  const rawRoute = routes?.[0]
  const firstStep = rawRoute?.steps?.[0]

  const {
    data: populatedStep,
    isLoading: stepLoading,
    isFetching: stepFetching,
    isFetched: stepFetched,
    isError: stepError,
    refetch: refetchStep,
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

  // A step-only failure won't re-run from a routes refetch (routes stay cached).
  const refetchAll = useCallback(() => {
    refetch()
    refetchStep()
  }, [refetch, refetchStep])

  return {
    route,
    routes,
    depositAddress: extractDepositAddress(route),
    isLoading: routesLoading || (Boolean(rawRoute) && stepLoading),
    isFetching: routesFetching || (Boolean(rawRoute) && stepFetching),
    isFetched: routesFetched && (!rawRoute || stepFetched),
    isError: (Boolean(rawRoute) && stepError) || routesIsError,
    refetch: refetchAll,
    setReviewableRoute,
  }
}
