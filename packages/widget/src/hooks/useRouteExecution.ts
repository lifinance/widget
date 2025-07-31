import type { ExchangeRateUpdateParams, Route } from '@lifi/sdk'
import { executeRoute, resumeRoute, updateRouteExecution } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import {
  useRouteExecutionStore,
  useRouteExecutionStoreContext,
} from '../stores/routes/RouteExecutionStore.js'
import {
  getUpdatedProcess,
  isRouteActive,
  isRouteDone,
  isRouteFailed,
} from '../stores/routes/utils.js'
import { WidgetEvent } from '../types/events.js'
import { getQueryKey } from '../utils/queries.js'
import { useWidgetEvents } from './useWidgetEvents.js'

interface RouteExecutionProps {
  routeId: string
  executeInBackground?: boolean
  onAcceptExchangeRateUpdate?(
    resolver: (value: boolean) => void,
    data: ExchangeRateUpdateParams
  ): void
}

export const useRouteExecution = ({
  routeId,
  executeInBackground,
  onAcceptExchangeRateUpdate,
}: RouteExecutionProps) => {
  const queryClient = useQueryClient()
  const { account } = useAccount()
  const resumedAfterMount = useRef(false)
  const { keyPrefix } = useWidgetConfig()
  const emitter = useWidgetEvents()
  const routeExecutionStoreContext = useRouteExecutionStoreContext()
  const routeExecution = useRouteExecutionStore(
    (state) => state.routes[routeId]
  )
  const [updateRoute, restartRoute, deleteRoute] = useRouteExecutionStore(
    (state) => [state.updateRoute, state.restartRoute, state.deleteRoute]
  )

  const updateRouteHook = (updatedRoute: Route) => {
    const routeExecution =
      routeExecutionStoreContext.getState().routes[updatedRoute.id]
    if (!routeExecution) {
      return
    }
    const clonedUpdatedRoute = structuredClone(updatedRoute)
    updateRoute(clonedUpdatedRoute)
    const process = getUpdatedProcess(routeExecution.route, clonedUpdatedRoute)
    if (process) {
      emitter.emit(WidgetEvent.RouteExecutionUpdated, {
        route: clonedUpdatedRoute,
        process,
      })
    }
    const executionCompleted = isRouteDone(clonedUpdatedRoute)
    const executionFailed = isRouteFailed(clonedUpdatedRoute)
    if (executionCompleted) {
      emitter.emit(WidgetEvent.RouteExecutionCompleted, clonedUpdatedRoute)
    }
    if (executionFailed && process) {
      emitter.emit(WidgetEvent.RouteExecutionFailed, {
        route: clonedUpdatedRoute,
        process,
      })
    }
    if (executionCompleted || executionFailed) {
      const invalidateKeys = [
        [
          getQueryKey('token-balances', keyPrefix),
          clonedUpdatedRoute.fromAddress,
          clonedUpdatedRoute.fromChainId,
        ],
        [
          getQueryKey('token-balances', keyPrefix),
          clonedUpdatedRoute.toAddress,
          clonedUpdatedRoute.toChainId,
        ],
        [getQueryKey('transaction-history', keyPrefix)],
      ]
      for (const key of invalidateKeys) {
        queryClient.invalidateQueries(
          {
            queryKey: key,
            exact: false,
            refetchType: 'all',
          },
          { cancelRefetch: false }
        )
      }
    }
    // biome-ignore lint/suspicious/noConsole: logs route information
    console.log('Route updated.', clonedUpdatedRoute)
  }

  const acceptExchangeRateUpdateHook = async (
    params: ExchangeRateUpdateParams
  ) => {
    if (!onAcceptExchangeRateUpdate) {
      return false
    }

    const accepted = await new Promise<boolean>((resolve) =>
      onAcceptExchangeRateUpdate(resolve, params)
    )

    return accepted
  }

  const executeRouteMutation = useMutation({
    mutationFn: () => {
      if (!account.isConnected) {
        throw new Error('Account is not connected.')
      }
      if (!routeExecution?.route) {
        throw new Error('Execution route not found.')
      }
      queryClient.removeQueries({
        queryKey: [getQueryKey('routes', keyPrefix)],
        exact: false,
      })
      return executeRoute(routeExecution.route, {
        updateRouteHook,
        acceptExchangeRateUpdateHook,
        infiniteApproval: false,
        executeInBackground,
      })
    },
    onMutate: () => {
      // biome-ignore lint/suspicious/noConsole: logs route information
      console.log('Execution started.', routeId)
      if (routeExecution) {
        emitter.emit(WidgetEvent.RouteExecutionStarted, routeExecution.route)
      }
    },
  })

  const resumeRouteMutation = useMutation({
    mutationFn: (resumedRoute?: Route) => {
      if (!account.isConnected) {
        throw new Error('Account is not connected.')
      }
      if (!routeExecution?.route) {
        throw new Error('Execution route not found.')
      }
      return resumeRoute(resumedRoute ?? routeExecution.route, {
        updateRouteHook,
        acceptExchangeRateUpdateHook,
        infiniteApproval: false,
        executeInBackground,
      })
    },
    onMutate: () => {
      // biome-ignore lint/suspicious/noConsole: logs route information
      console.log('Resumed to execution.', routeId)
    },
  })

  const _executeRoute = useCallback(() => {
    executeRouteMutation.mutateAsync(undefined, {
      onError: (error) => {
        console.warn('Execution failed!', routeId, error)
      },
      onSuccess: (route: Route) => {
        // biome-ignore lint/suspicious/noConsole: logs route information
        console.log('Executed successfully!', route)
      },
    })
  }, [executeRouteMutation, routeId])

  const _resumeRoute = useCallback(
    (route?: Route) => {
      resumeRouteMutation.mutateAsync(route, {
        onError: (error) => {
          console.warn('Resumed execution failed.', routeId, error)
        },
        onSuccess: (route) => {
          // biome-ignore lint/suspicious/noConsole: logs route information
          console.log('Resumed execution successful.', route)
        },
      })
    },
    [resumeRouteMutation, routeId]
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: run only when routeId changes
  const restartRouteMutation = useCallback(() => {
    restartRoute(routeId)
    _resumeRoute(routeExecution?.route)
  }, [_resumeRoute, routeExecution?.route, routeId])

  // biome-ignore lint/correctness/useExhaustiveDependencies: run only when routeId changes
  const deleteRouteMutation = useCallback(() => {
    deleteRoute(routeId)
  }, [routeId])

  // Resume route execution after page reload
  // biome-ignore lint/correctness/useExhaustiveDependencies: run only when routeId changes
  useEffect(() => {
    // Check if route is eligible for automatic resuming
    const route = routeExecutionStoreContext.getState().routes[routeId]?.route
    if (
      isRouteActive(route) &&
      account.isConnected &&
      !resumedAfterMount.current
    ) {
      resumedAfterMount.current = true
      _resumeRoute()
    }

    // Move execution to background on unmount
    return () => {
      const route = routeExecutionStoreContext.getState().routes[routeId]?.route
      if (!route || !isRouteActive(route)) {
        return
      }
      updateRouteExecution(route, { executeInBackground: true })
      // biome-ignore lint/suspicious/noConsole: logs route information
      console.log('Move route execution to background.', routeId)
      resumedAfterMount.current = false
    }
  }, [account.isConnected, routeExecutionStoreContext, routeId])

  return {
    executeRoute: _executeRoute,
    restartRoute: restartRouteMutation,
    deleteRoute: deleteRouteMutation,
    route: routeExecution?.route,
    status: routeExecution?.status,
  }
}
