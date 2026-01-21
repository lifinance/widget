# Widget Execution Flow


## Execution Flow

### 1. Route Selection → Transaction Page

When a user selects a route (swap/bridge), they navigate to `TransactionPage`, which displays the route details via the `Checkout` component.

### 2. Starting Execution

The flow begins when user clicks "Start Swapping/Bridging":

```typescript
// packages/widget/src/pages/TransactionPage/TransactionPage.tsx

const handleExecuteRoute = () => {
  tokenValueBottomSheetRef.current?.close()
  executeRoute()  // Triggers execution
  setFieldValue('fromAmount', '')
  // ...
}
```

Before execution starts, the widget may show confirmation dialogs for:
- **High value loss** - if the output value is significantly less than input
- **Low address activity** - if sending to an address with no transaction history

### 3. Core Execution Hook: `useRouteExecution`

The `executeRoute` function comes from the `useRouteExecution` hook which wraps the `@lifi/sdk`:

```typescript
// packages/widget/src/hooks/useRouteExecution.ts

const executeRouteMutation = useMutation({
  mutationFn: () => {
    if (!account.isConnected) {
      throw new Error('Account is not connected.')
    }
    if (!routeExecution?.route) {
      throw new Error('Execution route not found.')
    }
    
    return executeRoute(sdkClient, routeExecution.route, {
      updateRouteHook,              // Called on every status update
      acceptExchangeRateUpdateHook, // For rate change confirmations
      infiniteApproval: false,
      executeInBackground,
      ...sdkClient.config?.executionOptions,
    })
  },
  onMutate: () => {
    emitter.emit(WidgetEvent.RouteExecutionStarted, routeExecution.route)
  },
})
```

---

## Real-time Updates

### The `updateRouteHook` Callback

The SDK calls `updateRouteHook` whenever the route state changes:

```typescript
// packages/widget/src/hooks/useRouteExecution.ts

const updateRouteHook = (updatedRoute: Route) => {
  const routeExecution = routeExecutionStoreContext.getState().routes[updatedRoute.id]
  if (!routeExecution) return

  const clonedUpdatedRoute = structuredClone(updatedRoute)
  updateRoute(clonedUpdatedRoute)

  // Detect execution changes
  const execution = getUpdatedExecution(routeExecution.route, clonedUpdatedRoute)
  
  if (execution) {
    emitter.emit(WidgetEvent.RouteExecutionUpdated, {
      route: clonedUpdatedRoute,
      execution,
    })
  }

  // Check completion status
  const executionCompleted = isRouteDone(clonedUpdatedRoute)
  const executionFailed = isRouteFailed(clonedUpdatedRoute)

  if (executionCompleted) {
    emitter.emit(WidgetEvent.RouteExecutionCompleted, clonedUpdatedRoute)
  }
  
  if (executionFailed && execution) {
    emitter.emit(WidgetEvent.RouteExecutionFailed, {
      route: clonedUpdatedRoute,
      execution,
    })
  }

  // Invalidate token balance queries on completion
  if (executionCompleted || executionFailed) {
    queryClient.invalidateQueries({ queryKey: ['token-balances', ...] })
  }
}
```




## Auto-Resume on Page Reload

If a user refreshes the page mid-execution, the route automatically resumes:

```typescript
// packages/widget/src/hooks/useRouteExecution.ts

useEffect(() => {
  const route = routeExecutionStoreContext.getState().routes[routeId]?.route
  
  // Auto-resume active routes after mount
  if (isRouteActive(route) && account.isConnected && !resumedAfterMount.current) {
    resumedAfterMount.current = true
    _resumeRoute()
  }

  // Move execution to background on unmount
  return () => {
    const route = routeExecutionStoreContext.getState().routes[routeId]?.route
    if (route && isRouteActive(route)) {
      updateRouteExecution(route, { executeInBackground: true })
    }
  }
}, [account.isConnected, routeExecutionStoreContext, routeId])
```

---


