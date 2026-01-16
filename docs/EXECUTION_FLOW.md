# Widget Execution Flow

This document explains how transaction execution works in the LI.FI widget.

## Overview

The execution system handles swap and bridge transactions through a coordinated flow involving:
- **LI.FI SDK** - handles blockchain interactions
- **Zustand Store** - manages persistent state
- **React Query** - coordinates async operations with the UI
- **Event Emitter** - notifies integrators of execution progress

---

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

## Execution Status Flow

Routes transition through these statuses during execution:

```typescript
// packages/widget/src/stores/routes/types.ts

export enum RouteExecutionStatus {
  Idle = 1 << 0,      // Not started
  Pending = 1 << 1,   // In progress
  Done = 1 << 2,      // Completed successfully
  Failed = 1 << 3,    // Failed
  Partial = 1 << 4,   // Partially completed
  Refunded = 1 << 5,  // Refunded
}
```

### Status Diagram

```
┌──────┐     Start      ┌─────────┐
│ Idle │ ─────────────► │ Pending │
└──────┘                └────┬────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
         ┌────────┐    ┌──────────┐   ┌────────┐
         │  Done  │    │ Partial  │   │ Failed │
         └────────┘    └──────────┘   └───┬────┘
                                          │
                                          │ Retry
                                          ▼
                                    ┌─────────┐
                                    │ Pending │
                                    └─────────┘
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

  // Detect transaction changes
  const transaction = getUpdatedTransaction(routeExecution.route, clonedUpdatedRoute)
  
  if (transaction) {
    emitter.emit(WidgetEvent.RouteExecutionUpdated, {
      route: clonedUpdatedRoute,
      transaction,
    })
  }

  // Check completion status
  const executionCompleted = isRouteDone(clonedUpdatedRoute)
  const executionFailed = isRouteFailed(clonedUpdatedRoute)

  if (executionCompleted) {
    emitter.emit(WidgetEvent.RouteExecutionCompleted, clonedUpdatedRoute)
  }
  
  if (executionFailed && transaction) {
    emitter.emit(WidgetEvent.RouteExecutionFailed, {
      route: clonedUpdatedRoute,
      transaction,
    })
  }

  // Invalidate token balance queries on completion
  if (executionCompleted || executionFailed) {
    queryClient.invalidateQueries({ queryKey: ['token-balances', ...] })
  }
}
```

### Route Status Helpers

```typescript
// packages/widget/src/stores/routes/utils.ts

export const isRouteDone = (route: RouteExtended) => {
  return route.steps.every((step) => step.execution?.status === 'DONE')
}

export const isRoutePartiallyDone = (route: RouteExtended) => {
  return route.steps.some((step) => step.execution?.substatus === 'PARTIAL')
}

export const isRouteRefunded = (route: RouteExtended) => {
  return route.steps.some((step) => step.execution?.substatus === 'REFUNDED')
}

export const isRouteFailed = (route: RouteExtended) => {
  return route.steps.some((step) => step.execution?.status === 'FAILED')
}

export const isRouteActive = (route?: RouteExtended) => {
  if (!route) return false
  const isDone = isRouteDone(route)
  const isFailed = isRouteFailed(route)
  const alreadyStarted = route.steps.some((step) => step.execution)
  return !isDone && !isFailed && alreadyStarted
}
```

---

## State Persistence

### Zustand Store

Routes are stored in a persisted Zustand store so executions survive page reloads:

```typescript
// packages/widget/src/stores/routes/createRouteExecutionStore.ts

export const createRouteExecutionStore = ({ namePrefix }: PersistStoreProps) =>
  create<RouteExecutionState>()(
    persist(
      (set, get) => ({
        routes: {},
        
        setExecutableRoute: (route: Route, observableRouteIds?: string[]) => {
          // Stores new route with Idle status
          // Cleans up previous idle and done routes
        },
        
        updateRoute: (route: RouteExtended) => {
          // Updates route and automatically sets status based on step execution:
          // - FAILED if any step failed
          // - DONE if all steps done (with Partial/Refunded flags if applicable)
          // - PENDING if any step has execution in progress
        },
        
        deleteRoute: (routeId: string) => { /* ... */ },
        deleteRoutes: (type: 'completed' | 'active') => { /* ... */ },
      }),
      {
        name: `${namePrefix || 'li.fi'}-widget-routes`,
        version: 2,
        // Auto-cleanup: removes failed transactions after 1 day
      }
    )
  )
```

---

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

## Widget Events

The widget emits events throughout the execution lifecycle that integrators can listen to:

| Event | Payload | When |
|-------|---------|------|
| `RouteExecutionStarted` | `Route` | Execution begins |
| `RouteExecutionUpdated` | `{ route: Route, transaction: Transaction }` | Each transaction status change |
| `RouteExecutionCompleted` | `Route` | All steps completed successfully |
| `RouteExecutionFailed` | `{ route: Route, transaction: Transaction }` | Any step fails |
| `RouteHighValueLoss` | `{ fromAmountUSD, toAmountUSD, gasCostUSD, feeCostUSD, valueLoss }` | User confirms high value loss |

### Listening to Events

```typescript
import { useWidgetEvents, WidgetEvent } from '@lifi/widget'

const widgetEvents = useWidgetEvents()

useEffect(() => {
  const onRouteExecutionCompleted = (route) => {
    console.log('Route completed!', route)
  }
  
  widgetEvents.on(WidgetEvent.RouteExecutionCompleted, onRouteExecutionCompleted)
  
  return () => {
    widgetEvents.off(WidgetEvent.RouteExecutionCompleted, onRouteExecutionCompleted)
  }
}, [widgetEvents])
```

---

## UI Components

### `StepExecution`

Displays the current execution status with a progress indicator and transaction links:

```typescript
// packages/widget/src/components/Checkout/StepExecution.tsx

export const StepExecution: React.FC<{ step: LiFiStepExtended }> = ({ step }) => {
  const { title } = useExecutionMessage(step)
  const { getTransactionLink } = useExplorer()

  if (!step.execution) return null

  // Renders:
  // - CircularProgress indicator
  // - Status message (e.g., "Waiting for signature", "Swap pending")
  // - Transaction links when available
}
```

### Execution Messages

Status messages are mapped based on transaction type and execution status:

```typescript
// packages/widget/src/hooks/useExecutionMessage.ts

const processStatusMessages = {
  TOKEN_ALLOWANCE: {
    STARTED: 'Approving token allowance...',
    ACTION_REQUIRED: 'Please approve {tokenSymbol} in your wallet',
    PENDING: 'Waiting for approval confirmation...',
    DONE: '{tokenSymbol} approved',
  },
  SWAP: {
    STARTED: 'Preparing swap...',
    ACTION_REQUIRED: 'Please confirm the swap in your wallet',
    PENDING: 'Swap pending...',
    DONE: 'Swap completed',
  },
  CROSS_CHAIN: {
    STARTED: 'Preparing bridge transaction...',
    ACTION_REQUIRED: 'Please confirm the bridge in your wallet',
    PENDING: 'Bridge transaction pending...',
    DONE: 'Bridge completed',
  },
  // ...
}
```

---

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                        TransactionPage                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                      Checkout                              │  │
│  │  ┌─────────────────┐  ┌────────────────────────────────┐  │  │
│  │  │  StepExecution  │  │  Token Details & Route Info    │  │  │
│  │  │  (status, tx)   │  │                                │  │  │
│  │  └─────────────────┘  └────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ executeRoute()
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     useRouteExecution                           │
│  - Wraps @lifi/sdk executeRoute/resumeRoute                     │
│  - Manages mutations via React Query                            │
│  - Emits widget events                                          │
│  - Handles auto-resume on mount                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ updateRouteHook()
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   RouteExecutionStore (Zustand)                 │
│  - Persists routes to localStorage                              │
│  - Tracks execution status                                      │
│  - Auto-cleans old failed routes                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        @lifi/sdk                                │
│  - Handles wallet interactions                                  │
│  - Manages transaction signing                                  │
│  - Tracks cross-chain status                                    │
└─────────────────────────────────────────────────────────────────┘
```
