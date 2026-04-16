import type { ExchangeRateUpdateParams, Route, RouteExtended } from '@lifi/sdk'
import { executeRoute, resumeRoute, updateRouteExecution } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef } from 'react'
import { useSDKClient } from '../providers/SDKClientProvider.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import {
  useRouteExecutionStore,
  useRouteExecutionStoreContext,
} from '../stores/routes/RouteExecutionStore.js'
import type { RouteExecutionStatus } from '../stores/routes/types.js'
import {
  getUpdatedAction,
  isRouteActive,
  isRouteDone,
  isRouteFailed,
} from '../stores/routes/utils.js'
import { WidgetEvent } from '../types/events.js'
import { getQueryKey } from '../utils/queries.js'
import { enqueueStaggered, markStaggeredFlush } from '../utils/staggerQueue.js'
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
}: RouteExecutionProps): {
  executeRoute: () => void
  restartRoute: () => void
  deleteRoute: () => void
  route: RouteExtended | undefined
  status: RouteExecutionStatus | undefined
} => {
  const queryClient = useQueryClient()
  const { account } = useAccount()
  const resumedAfterMount = useRef(false)
  const { keyPrefix } = useWidgetConfig()
  const sdkClient = useSDKClient()
  const emitter = useWidgetEvents()
  const routeExecutionStoreContext = useRouteExecutionStoreContext()
  const routeExecution = useRouteExecutionStore(
    (state) => state.routes[routeId]
  )
  const [updateRoute, deleteRoute] = useRouteExecutionStore((state) => [
    state.updateRoute,
    state.deleteRoute,
  ])

  const updateRouteHook = (updatedRoute: Route) => {
    const clonedUpdatedRoute = structuredClone(updatedRoute)
    enqueueStaggered(() => {
      const routeExecution =
        routeExecutionStoreContext.getState().routes[clonedUpdatedRoute.id]
      if (!routeExecution) {
        return
      }
      updateRoute(clonedUpdatedRoute)
      const action = getUpdatedAction(routeExecution.route, clonedUpdatedRoute)
      if (action) {
        emitter.emit(WidgetEvent.RouteExecutionUpdated, {
          route: clonedUpdatedRoute,
          action,
        })
      }
      const executionCompleted = isRouteDone(clonedUpdatedRoute)
      const executionFailed = isRouteFailed(clonedUpdatedRoute)
      if (executionCompleted) {
        emitter.emit(WidgetEvent.RouteExecutionCompleted, clonedUpdatedRoute)
      }
      if (executionFailed && action) {
        emitter.emit(WidgetEvent.RouteExecutionFailed, {
          route: clonedUpdatedRoute,
          action,
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
    })
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
      return executeRoute(sdkClient, routeExecution.route, {
        updateRouteHook,
        acceptExchangeRateUpdateHook,
        infiniteApproval: false,
        executeInBackground,
        ...sdkClient.config?.executionOptions,
      })
    },
    onMutate: () => {
      // biome-ignore lint/suspicious/noConsole: logs route information
      console.log('Execution started.', routeId)
      if (routeExecution) {
        emitter.emit(WidgetEvent.RouteExecutionStarted, routeExecution.route)
      }
    },
    onError: (error) => {
      console.warn('Execution failed!', routeId, error)
    },
    onSuccess: (route: Route) => {
      // biome-ignore lint/suspicious/noConsole: logs route information
      console.log('Executed successfully!', route)
    },
  })

  const resumeRouteMutation = useMutation({
    mutationFn: (args?: { route?: Route; executeInBackground?: boolean }) => {
      if (!account.isConnected) {
        throw new Error('Account is not connected.')
      }
      if (!routeExecution?.route) {
        throw new Error('Execution route not found.')
      }
      return resumeRoute(sdkClient, args?.route ?? routeExecution.route, {
        updateRouteHook,
        acceptExchangeRateUpdateHook,
        infiniteApproval: false,
        executeInBackground: args?.executeInBackground ?? executeInBackground,
      })
    },
    onMutate: () => {
      // biome-ignore lint/suspicious/noConsole: logs route information
      console.log('Resumed to execution.', routeId)
    },
    onError: (error) => {
      console.warn('Resumed execution failed.', routeId, error)
    },
    onSuccess: (route) => {
      // biome-ignore lint/suspicious/noConsole: logs route information
      console.log('Resumed execution successful.', route)
    },
  })

  const _executeRoute = useCallback(() => {
    executeRouteMutation.mutateAsync(undefined)
  }, [executeRouteMutation])

  const _resumeRoute = useCallback(
    (route?: Route) => {
      resumeRouteMutation.mutateAsync({ route })
    },
    [resumeRouteMutation]
  )

  const restartRouteMutation = useCallback(() => {
    const route = routeExecution?.route
    if (route) {
      // Flip any failed step AND its failed actions back to pending so the
      // UI lands on the resumed state immediately. Resetting the step alone
      // would leave action.status === 'FAILED', which makes the Pending
      // branch of useRouteExecutionMessage return undefined title/message
      // and briefly unmount the text blocks before the SDK's first post-resume
      // update arrives. Clearing error/substatus keeps the action-row view
      // consistent with its new status.
      const reset = structuredClone(route)
      for (const step of reset.steps) {
        if (step.execution?.status === 'FAILED') {
          step.execution.status = 'PENDING'
          for (const action of step.execution.actions ?? []) {
            if (action.status === 'FAILED') {
              action.status = 'PENDING'
              action.error = undefined
              action.substatus = undefined
              action.substatusMessage = undefined
            }
          }
        }
      }
      updateRoute(reset)
      // The sync reset bypasses enqueueStaggered. Mark a flush now so the
      // SDK's first post-resume update goes through the gate instead of
      // firing back-to-back against the reset animation.
      markStaggeredFlush()
    }
    resumeRouteMutation.mutateAsync({
      route: routeExecution?.route,
      executeInBackground: false,
    })
  }, [resumeRouteMutation, routeExecution?.route, updateRoute])

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
