# Funding Orders Widget Checkout Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the checkout UI (`@lifi/widget-checkout` + `@lifi/widget-provider/checkout` + provider hosts) from the hand-rolled `/v1/checkout/*` integration onto the funding-orders SDK surface (`createFundingOrder`, `getFundingOrder`, `waitForFundingOrder`, helper actions, `convertOrderToRoute`).

**Architecture:** Each funding source becomes an order: wallet → `STANDARD` (executed through the existing `useRouteExecution` machinery via the SDK's order-derived synthetic route, whose `route.id === orderId`), transfer/exchange → `SMART_DEPOSIT`, cash → `ONRAMP` (backend creates the Transak session; the host mounts `order.onramp.widgetUrl`). One order poller drives one status page; a thin orderId list replaces the versioned PendingRecord store; one completion observer fires `onSuccess`/`onError` for all four sources.

**Tech Stack:** React 19, zustand 5, TanStack Query + Router, vitest (`node` env; `// @vitest-environment happy-dom` pragma for DOM tests; **no msw** — mock SDK actions with `vi.mock`), Biome, tsdown, Changesets.

**Spec:** `/Users/eugene/Projects/sdk/docs/superpowers/specs/2026-08-11-funding-orders-sdk-widget-integration-design.md` §6 (widget), §7 (errors). SDK surface reference: `/Users/eugene/Projects/sdk/docs/superpowers/plans/2026-08-11-funding-orders-sdk.md` (branch `feat/funding-orders-integration` in `/Users/eugene/Projects/sdk`).

## Global Constraints

- Branch: `feat/funding-orders-checkout` in `/Users/eugene/Projects/widget` (created from `origin/main`).
- **The local SDK is consumed via workspace link** (`pnpm link:sdk`, Task 1). **Never commit `pnpm-workspace.yaml` or `pnpm-lock.yaml` while linked** — the link script writes a `# LOCAL ONLY — do not commit (sdk link)` marker. Stage files explicitly; never `git add -A`.
- `isolatedDeclarations: true` — exported functions need explicit return types; exported `createContext` results need `Context<T>` annotations.
- Biome: run `pnpm check:write` after changes; it may reorder imports — expected.
- ESM only. No default exports in library code. Minimal comments (only non-obvious *why*).
- Tests: `pnpm --filter @lifi/widget-checkout test` (vitest run). New DOM tests start with `// @vitest-environment happy-dom`. Type check: `pnpm --filter @lifi/widget-checkout check:types` (and per touched package).
- Conventional commits (`feat:`, `fix:`, `refactor:`, `test:`). `@lifi/widget-checkout` is `private: true` (no changeset needed for it); `@lifi/widget`, `@lifi/widget-provider`, `@lifi/widget-provider-transak`, `@lifi/widget-provider-mesh` are publishable — one changeset at the end (Task 12) covers them.
- SDK types: `substatus` is an **open string**; `FundingOrderStatus` = `'PENDING' | 'DONE' | 'FAILED'`; `onramp.estimatedFundingAmount` exists **only on the create response** — capture it at create time.
- Order polling floor: 10 s (each non-terminal read triggers a backend refresh).
- `partnerOrderId` = `crypto.randomUUID()` per attempt; a retry after FAILED always creates a new order.
- **Decision (flagged for review):** `refundAddress` for `SMART_DEPOSIT` and `ONRAMP` orders = the destination `toAddress` (the user's receiving address). No separate refund-address input in V1.
- **Decision:** cash pre-commit fiat estimate and fiat-currency list keep using the pinned USDC/Ethereum token (`checkoutDefaults.ts`) via the SDK helper actions; the committed amounts come from the ONRAMP create response.

## File Map

| Area | File | Action |
|---|---|---|
| Link | `pnpm-workspace.yaml` | Local-only link overrides (never committed) |
| Store | `packages/widget-checkout/src/stores/useFundingOrderStore.ts` | Create (thin orderId list) |
| Poll | `packages/widget-checkout/src/hooks/useFundingOrder.ts` | Create |
| Completion | `packages/widget-checkout/src/hooks/useFundingOrderCompletion.ts` | Create |
| Params | `packages/widget-checkout/src/utils/buildOrderRequest.ts` | Create |
| Status view | `packages/widget-checkout/src/utils/orderStatusView.ts` | Create |
| Core | `packages/widget/src/hooks/useRoutes.ts` | Add per-request `allowExchanges` option |
| Flows | `CheckoutFlowCtaButton.tsx`, `SelectSourcePage`, `TransferDepositPage`, `CheckoutTransactionPage.tsx`, `CheckoutTransactionStatusPage` | Modify |
| Hosts | `widget-provider/src/checkout/types.ts` (open args), `TransakHost.tsx`, `MeshHost.tsx` | Modify |
| Helpers | `useOnRampQuote.ts`, `useOnRampFiatCurrencies.ts` | Rewrite onto SDK actions |
| Delete | `sessionClient.ts`, `api.ts`, `CheckoutSdkBridge.tsx`, `depositAddressStatus.ts`, `statusHints.ts`, `getSourceTxIdentifier.ts`, `extractDepositAddress.ts`, `types/checkoutRoute.ts`, `useCheckoutFlowQuote.ts`, `useFrozenQuote.tsx`, `useCheckoutExchangesOverride.ts`, `usePendingCheckoutStore.ts`, `usePendingCheckoutWriter.ts`, `useCheckoutPendingRecords.ts` (rewritten), `useCheckoutTransactionStatus.ts`, `useTransferStatusPoll.ts`, `useMeshBalance.ts`, dead router subtree | Task-by-task |

---

### Task 1: Link the local SDK and verify the surface

**Files:**
- Modify (local only, never committed): `pnpm-workspace.yaml`, `pnpm-lock.yaml`

**Interfaces:**
- Produces: `@lifi/sdk` resolving to `/Users/eugene/Projects/sdk/packages/sdk` (branch `feat/funding-orders-integration`) for every widget package. All later tasks import `createFundingOrder`, `getFundingOrder`, `waitForFundingOrder`, `getOnrampQuote`, `getOnrampFiatCurrencies`, `createCexSession`, `convertOrderToRoute`, and the funding types from `@lifi/sdk`.

- [ ] **Step 1: Build and globally link the SDK packages**

```bash
cd /Users/eugene/Projects/sdk
git switch feat/funding-orders-integration
pnpm install && pnpm build
for p in sdk sdk-provider-bitcoin sdk-provider-ethereum sdk-provider-solana sdk-provider-sui sdk-provider-tron; do
  (cd packages/$p && pnpm link --global)
done
```

- [ ] **Step 2: Link into the widget repo**

```bash
cd /Users/eugene/Projects/widget
pnpm link:sdk
```

This runs `scripts/linkSdk.js` → writes `link:` overrides into `pnpm-workspace.yaml` under the `# LOCAL ONLY — do not commit (sdk link)` marker and runs `pnpm install`.

- [ ] **Step 3: Verify the funding surface resolves**

```bash
node -e "import('@lifi/sdk').then(m => console.log(typeof m.createFundingOrder, typeof m.convertOrderToRoute, typeof m.waitForFundingOrder))" --input-type=module 2>/dev/null || true
pnpm --filter @lifi/widget-checkout check:types
```

If `check:types` fails on unrelated pre-existing issues, note them; the gate is that `@lifi/sdk` imports resolve. If the funding exports are missing, the SDK build is stale — rebuild the SDK repo.

- [ ] **Step 4: Guard note (no commit)**

Nothing to commit in this task. Verify `git status` shows only `pnpm-workspace.yaml`/`pnpm-lock.yaml` modified and leave them unstaged for the rest of the plan.

---

### Task 2: Thin funding-order store

**Files:**
- Create: `packages/widget-checkout/src/stores/useFundingOrderStore.ts`
- Test: `packages/widget-checkout/src/stores/useFundingOrderStore.test.ts`

**Interfaces:**
- Consumes: `CheckoutFundingSource` from `../stores/useCheckoutFlowStore.js`.
- Produces:
  - `interface TrackedFundingOrder { orderId: string; fundingSource: CheckoutFundingSource; createdAt: number }`
  - `useFundingOrderStore` (zustand persist store): `orders: Record<string, TrackedFundingOrder>`, `track(order)`, `acknowledge(orderId)`, `clearAll()`
  - `FUNDING_ORDER_STORAGE_KEY = 'lifi-checkout-orders'`, `FUNDING_ORDER_RETENTION_MS = 7 * 24 * 60 * 60 * 1000`
  - `listTrackedOrders(orders, now): TrackedFundingOrder[]` (live records, newest first)

- [ ] **Step 1: Write the failing test**

```ts
import { beforeEach, describe, expect, it } from 'vitest'
import {
  FUNDING_ORDER_RETENTION_MS,
  listTrackedOrders,
  useFundingOrderStore,
} from './useFundingOrderStore.js'

describe('useFundingOrderStore', () => {
  beforeEach(() => {
    useFundingOrderStore.getState().clearAll()
  })

  it('tracks an order and lists it newest first', () => {
    const { track } = useFundingOrderStore.getState()
    track({ orderId: 'a', fundingSource: 'wallet', createdAt: 1 })
    track({ orderId: 'b', fundingSource: 'transfer', createdAt: 2 })
    const list = listTrackedOrders(
      useFundingOrderStore.getState().orders,
      Date.now()
    )
    expect(list.map((o) => o.orderId)).toEqual(['b', 'a'])
  })

  it('acknowledge removes the record', () => {
    const { track, acknowledge } = useFundingOrderStore.getState()
    track({ orderId: 'a', fundingSource: 'cash', createdAt: 1 })
    acknowledge('a')
    expect(useFundingOrderStore.getState().orders.a).toBeUndefined()
  })

  it('prunes records older than the retention window on write', () => {
    const now = Date.now()
    const { track } = useFundingOrderStore.getState()
    track({
      orderId: 'old',
      fundingSource: 'transfer',
      createdAt: now - FUNDING_ORDER_RETENTION_MS - 1,
    })
    track({ orderId: 'fresh', fundingSource: 'transfer', createdAt: now })
    expect(useFundingOrderStore.getState().orders.old).toBeUndefined()
    expect(useFundingOrderStore.getState().orders.fresh).toBeDefined()
  })
})
```

- [ ] **Step 2: Run — expect failure** (module missing)

Run: `pnpm --filter @lifi/widget-checkout test useFundingOrderStore`

- [ ] **Step 3: Implement**

```ts
'use client'
import { create, type StoreApi, type UseBoundStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { CheckoutFundingSource } from './useCheckoutFlowStore.js'

export const FUNDING_ORDER_STORAGE_KEY = 'lifi-checkout-orders'
export const FUNDING_ORDER_RETENTION_MS: number = 7 * 24 * 60 * 60 * 1000

export interface TrackedFundingOrder {
  orderId: string
  fundingSource: CheckoutFundingSource
  createdAt: number
}

interface FundingOrderState {
  orders: Record<string, TrackedFundingOrder>
  track: (order: TrackedFundingOrder) => void
  acknowledge: (orderId: string) => void
  clearAll: () => void
}

function prune(
  orders: Record<string, TrackedFundingOrder>,
  now: number
): Record<string, TrackedFundingOrder> {
  const out: Record<string, TrackedFundingOrder> = {}
  for (const [id, order] of Object.entries(orders)) {
    if (now - order.createdAt <= FUNDING_ORDER_RETENTION_MS) {
      out[id] = order
    }
  }
  return out
}

export function listTrackedOrders(
  orders: Record<string, TrackedFundingOrder>,
  now: number
): TrackedFundingOrder[] {
  return Object.values(prune(orders, now)).sort(
    (a, b) => b.createdAt - a.createdAt
  )
}

export const useFundingOrderStore: UseBoundStore<StoreApi<FundingOrderState>> =
  create<FundingOrderState>()(
    persist(
      (set) => ({
        orders: {},
        track: (order) =>
          set((state) => ({
            orders: { ...prune(state.orders, Date.now()), [order.orderId]: order },
          })),
        acknowledge: (orderId) =>
          set((state) => {
            if (!(orderId in state.orders)) {
              return state
            }
            const { [orderId]: _removed, ...rest } = state.orders
            return { orders: rest }
          }),
        clearAll: () => set({ orders: {} }),
      }),
      {
        name: FUNDING_ORDER_STORAGE_KEY,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ orders: state.orders }),
        onRehydrateStorage: () => (rehydrated, error) => {
          if (error || !rehydrated) {
            return
          }
          rehydrated.orders = prune(rehydrated.orders, Date.now())
        },
        version: 1,
      }
    )
  )
```

Note: the vitest environment is `node` — `localStorage` is absent, and `createJSONStorage(() => localStorage)` handles that by returning a noop storage; the tests above exercise in-memory state only. Do not add a happy-dom pragma here.

- [ ] **Step 4: Run — expect pass**

Run: `pnpm --filter @lifi/widget-checkout test useFundingOrderStore && pnpm --filter @lifi/widget-checkout check:types`

- [ ] **Step 5: Commit**

```bash
git add packages/widget-checkout/src/stores/useFundingOrderStore.ts packages/widget-checkout/src/stores/useFundingOrderStore.test.ts
git commit -m "feat(checkout): add the thin funding-order tracking store"
```

---

### Task 3: Order poller and request builders

**Files:**
- Create: `packages/widget-checkout/src/hooks/useFundingOrder.ts`
- Create: `packages/widget-checkout/src/utils/buildOrderRequest.ts`
- Test: `packages/widget-checkout/src/hooks/useFundingOrder.test.tsx`, `packages/widget-checkout/src/utils/buildOrderRequest.test.ts`

**Interfaces:**
- Consumes: `getFundingOrder`, types `FundingOrder`, `CreateFundingOrderRequest` from `@lifi/sdk`; `useSDKClient` from `@lifi/widget/shared`.
- Produces:
  - `fundingOrderQueryKey(orderId: string | null): readonly unknown[]` → `['funding-order', orderId]`
  - `type OrderPhase = 'pending' | 'done' | 'failed'`
  - `useFundingOrder(orderId: string | null): { order: FundingOrder | undefined; phase: OrderPhase | undefined; isLoading: boolean; isError: boolean; refetch: () => void }` — polls every 10 s until terminal, then stops.
  - `buildStandardOrderRequest(args)`, `buildSmartDepositOrderRequest(args)`, `buildOnrampOrderRequest(args)` — pure builders returning `CreateFundingOrderRequest`.

- [ ] **Step 1: Write the failing builder test**

`buildOrderRequest.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import {
  buildOnrampOrderRequest,
  buildSmartDepositOrderRequest,
  buildStandardOrderRequest,
} from './buildOrderRequest.js'

const destination = {
  toChainId: 8453,
  toTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  toAddress: '0xDest',
}

describe('buildOrderRequest', () => {
  it('builds a STANDARD request with the source leg', () => {
    const req = buildStandardOrderRequest({
      ...destination,
      fromChainId: 1,
      fromTokenAddress: '0xFrom',
      fromAmount: '1000000',
      fromAddress: '0xWallet',
    })
    expect(req.type).toBe('STANDARD')
    expect(req.partnerOrderId).toMatch(/[0-9a-f-]{36}/)
    expect(req.fromAddress).toBe('0xWallet')
    expect(req.refundAddress).toBeUndefined()
  })

  it('builds a SMART_DEPOSIT request with refundAddress = toAddress', () => {
    const req = buildSmartDepositOrderRequest({
      ...destination,
      fromChainId: 1,
      fromTokenAddress: '0xFrom',
      fromAmount: '1000000',
    })
    expect(req.type).toBe('SMART_DEPOSIT')
    expect(req.refundAddress).toBe('0xDest')
    expect(req.fromAddress).toBeUndefined()
  })

  it('builds an ONRAMP request without a source leg', () => {
    const req = buildOnrampOrderRequest({
      ...destination,
      fiatAmount: '100',
      fiatCurrency: 'EUR',
      paymentMethod: 'credit_debit_card',
    })
    expect(req.type).toBe('ONRAMP')
    expect(req.refundAddress).toBe('0xDest')
    expect(req.fromChainId).toBeUndefined()
    expect(req.fiatAmount).toBe('100')
  })

  it('generates a fresh partnerOrderId per call', () => {
    const a = buildOnrampOrderRequest({ ...destination, fiatAmount: '1', fiatCurrency: 'EUR' })
    const b = buildOnrampOrderRequest({ ...destination, fiatAmount: '1', fiatCurrency: 'EUR' })
    expect(a.partnerOrderId).not.toBe(b.partnerOrderId)
  })
})
```

- [ ] **Step 2: Run — expect failure**, then implement `buildOrderRequest.ts`

```ts
import type { CreateFundingOrderRequest } from '@lifi/sdk'

interface Destination {
  toChainId: number
  toTokenAddress: string
  toAddress: string
}

export function buildStandardOrderRequest(
  args: Destination & {
    fromChainId: number
    fromTokenAddress: string
    fromAmount: string
    fromAddress: string
  }
): CreateFundingOrderRequest {
  return {
    partnerOrderId: crypto.randomUUID(),
    type: 'STANDARD',
    toChainId: args.toChainId,
    toTokenAddress: args.toTokenAddress,
    toAddress: args.toAddress,
    fromChainId: args.fromChainId,
    fromTokenAddress: args.fromTokenAddress,
    fromAmount: args.fromAmount,
    fromAddress: args.fromAddress,
  }
}

export function buildSmartDepositOrderRequest(
  args: Destination & {
    fromChainId: number
    fromTokenAddress: string
    fromAmount: string
  }
): CreateFundingOrderRequest {
  return {
    partnerOrderId: crypto.randomUUID(),
    type: 'SMART_DEPOSIT',
    toChainId: args.toChainId,
    toTokenAddress: args.toTokenAddress,
    toAddress: args.toAddress,
    fromChainId: args.fromChainId,
    fromTokenAddress: args.fromTokenAddress,
    fromAmount: args.fromAmount,
    // V1: refunds return to the user's receiving address.
    refundAddress: args.toAddress,
  }
}

export function buildOnrampOrderRequest(
  args: Destination & {
    fiatAmount: string
    fiatCurrency: string
    paymentMethod?: string
    countryCode?: string
  }
): CreateFundingOrderRequest {
  return {
    partnerOrderId: crypto.randomUUID(),
    type: 'ONRAMP',
    toChainId: args.toChainId,
    toTokenAddress: args.toTokenAddress,
    toAddress: args.toAddress,
    fiatAmount: args.fiatAmount,
    fiatCurrency: args.fiatCurrency,
    paymentMethod: args.paymentMethod,
    countryCode: args.countryCode,
    refundAddress: args.toAddress,
  }
}
```

- [ ] **Step 3: Write the failing poller test**

`useFundingOrder.test.tsx` (mock the SDK action; drive phases):

```tsx
// @vitest-environment happy-dom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@lifi/sdk', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  getFundingOrder: vi.fn(),
}))
vi.mock('@lifi/widget/shared', () => ({
  useSDKClient: () => ({ config: {} }),
}))

import { getFundingOrder } from '@lifi/sdk'
import { useFundingOrder } from './useFundingOrder.js'

const order = (status: 'PENDING' | 'DONE' | 'FAILED') => ({
  orderId: 'o-1',
  partnerOrderId: 'p-1',
  type: 'SMART_DEPOSIT' as const,
  status,
  destination: { toChainId: 8453, toTokenAddress: '0x1', toAddress: '0x2' },
  createdAt: '',
  updatedAt: '',
})

function wrap({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useFundingOrder', () => {
  it('resolves the order and derives the phase', async () => {
    vi.mocked(getFundingOrder).mockResolvedValue(order('DONE') as any)
    const { result } = renderHook(() => useFundingOrder('o-1'), {
      wrapper: wrap,
    })
    await waitFor(() => expect(result.current.order).toBeDefined())
    expect(result.current.phase).toBe('done')
  })

  it('is disabled with a null orderId', () => {
    const { result } = renderHook(() => useFundingOrder(null), {
      wrapper: wrap,
    })
    expect(result.current.order).toBeUndefined()
    expect(vi.mocked(getFundingOrder)).not.toHaveBeenCalled()
  })

  it('maps FAILED to the failed phase', async () => {
    vi.mocked(getFundingOrder).mockResolvedValue(order('FAILED') as any)
    const { result } = renderHook(() => useFundingOrder('o-1'), {
      wrapper: wrap,
    })
    await waitFor(() => expect(result.current.phase).toBe('failed'))
  })
})
```

- [ ] **Step 4: Run — expect failure**, then implement `useFundingOrder.ts`

```ts
'use client'
import type { FundingOrder } from '@lifi/sdk'
import { getFundingOrder } from '@lifi/sdk'
import { useSDKClient } from '@lifi/widget/shared'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export const ORDER_POLLING_INTERVAL_MS = 10_000

export function fundingOrderQueryKey(
  orderId: string | null
): readonly unknown[] {
  return ['funding-order', orderId]
}

export type OrderPhase = 'pending' | 'done' | 'failed'

export function orderPhase(
  order: FundingOrder | undefined
): OrderPhase | undefined {
  if (!order) {
    return undefined
  }
  if (order.status === 'DONE') {
    return 'done'
  }
  if (order.status === 'FAILED') {
    return 'failed'
  }
  return 'pending'
}

export interface UseFundingOrderResult {
  order: FundingOrder | undefined
  phase: OrderPhase | undefined
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

export function useFundingOrder(
  orderId: string | null
): UseFundingOrderResult {
  const sdkClient = useSDKClient()
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: fundingOrderQueryKey(orderId),
    queryFn: ({ signal }) =>
      getFundingOrder(sdkClient, orderId as string, undefined, { signal }),
    enabled: Boolean(orderId),
    placeholderData: keepPreviousData,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status === 'DONE' || status === 'FAILED') {
        return false
      }
      return ORDER_POLLING_INTERVAL_MS
    },
  })
  return {
    order: data,
    phase: orderPhase(data),
    isLoading,
    isError,
    refetch: () => {
      void refetch()
    },
  }
}
```

- [ ] **Step 5: Run — expect pass; commit**

Run: `pnpm --filter @lifi/widget-checkout test useFundingOrder buildOrderRequest && pnpm --filter @lifi/widget-checkout check:types`

```bash
git add packages/widget-checkout/src/hooks/useFundingOrder.ts packages/widget-checkout/src/hooks/useFundingOrder.test.tsx packages/widget-checkout/src/utils/buildOrderRequest.ts packages/widget-checkout/src/utils/buildOrderRequest.test.ts
git commit -m "feat(checkout): add the funding order poller and request builders"
```

---

### Task 4: Completion observer (`onSuccess`/`onError` for all sources)

**Files:**
- Create: `packages/widget-checkout/src/hooks/useFundingOrderCompletion.ts`
- Test: `packages/widget-checkout/src/hooks/useFundingOrderCompletion.test.tsx`

**Interfaces:**
- Consumes: `FundingOrder` from `@lifi/sdk`; `useCheckoutConfig` (`CheckoutResult`, `CheckoutError`) from `@lifi/widget-provider/checkout`; `useCheckoutFlowStore` (`fundingSource`).
- Produces: `useFundingOrderCompletion(order: FundingOrder | undefined): void` — fires `onSuccess(result)` exactly once per orderId on `DONE`, `onError({ code, message })` exactly once per orderId on `FAILED`. Mapping: `provider` = current `fundingSource` (fallback `'checkout'`), `transactionHash` = `order.result?.toTxHash`, `amount` = `order.result?.toAmount ?? ''`, `token` = `order.destination.toTokenAddress`, `chainId` = `order.destination.toChainId`, `depositAddress` = `order.depositAddress`. Error: `code` = `order.substatus ?? 'ORDER_FAILED'`.

- [ ] **Step 1: Write the failing test**

```tsx
// @vitest-environment happy-dom
import { CheckoutContext } from '@lifi/widget-provider/checkout'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import {
  CheckoutFlowStoreContext,
  createCheckoutFlowStore,
} from '../stores/useCheckoutFlowStore.js'
import { useFundingOrderCompletion } from './useFundingOrderCompletion.js'

const order = (status: 'PENDING' | 'DONE' | 'FAILED', substatus?: string) =>
  ({
    orderId: 'o-1',
    partnerOrderId: 'p',
    type: 'SMART_DEPOSIT',
    status,
    substatus,
    destination: { toChainId: 8453, toTokenAddress: '0xT', toAddress: '0xA' },
    result: { toTxHash: '0xdest', toAmount: '990' },
    createdAt: '',
    updatedAt: '',
  }) as any

function wrap(onSuccess: () => void, onError: () => void) {
  const flowStore = createCheckoutFlowStore()
  flowStore.getState().setFundingSource('transfer')
  return ({ children }: { children: ReactNode }) => (
    <CheckoutContext.Provider value={{ integrator: 'int', onSuccess, onError }}>
      <CheckoutFlowStoreContext.Provider value={flowStore}>
        {children}
      </CheckoutFlowStoreContext.Provider>
    </CheckoutContext.Provider>
  )
}

describe('useFundingOrderCompletion', () => {
  it('fires onSuccess exactly once for a DONE order', () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()
    const { rerender } = renderHook(
      ({ o }) => useFundingOrderCompletion(o),
      { wrapper: wrap(onSuccess, onError), initialProps: { o: order('DONE') } }
    )
    rerender({ o: order('DONE') })
    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(onSuccess).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: 'transfer',
        transactionHash: '0xdest',
        amount: '990',
        chainId: 8453,
      })
    )
    expect(onError).not.toHaveBeenCalled()
  })

  it('fires onError once with the substatus code for a FAILED order', () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()
    const { rerender } = renderHook(
      ({ o }) => useFundingOrderCompletion(o),
      {
        wrapper: wrap(onSuccess, onError),
        initialProps: { o: order('FAILED', 'ONRAMP_REFUNDED') },
      }
    )
    rerender({ o: order('FAILED', 'ONRAMP_REFUNDED') })
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ code: 'ONRAMP_REFUNDED' })
    )
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('does nothing for a PENDING order', () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()
    renderHook(() => useFundingOrderCompletion(order('PENDING')), {
      wrapper: wrap(onSuccess, onError),
    })
    expect(onSuccess).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run — expect failure**, then implement

```ts
'use client'
import type { FundingOrder } from '@lifi/sdk'
import { useCheckoutConfig } from '@lifi/widget-provider/checkout'
import { useContext, useEffect, useRef } from 'react'
import { useStore } from 'zustand'
import { CheckoutFlowStoreContext } from '../stores/useCheckoutFlowStore.js'

export function useFundingOrderCompletion(
  order: FundingOrder | undefined
): void {
  const { onSuccess, onError } = useCheckoutConfig()
  const flowStore = useContext(CheckoutFlowStoreContext)
  const fundingSource = useStore(
    flowStore ?? ({ getState: () => ({ fundingSource: null }) } as never),
    (s: { fundingSource: string | null }) => s.fundingSource
  )
  const firedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!order || firedRef.current.has(order.orderId)) {
      return
    }
    if (order.status === 'DONE') {
      firedRef.current.add(order.orderId)
      onSuccess?.({
        provider: fundingSource ?? 'checkout',
        transactionHash: order.result?.toTxHash,
        amount: order.result?.toAmount ?? '',
        token: order.destination.toTokenAddress,
        chainId: order.destination.toChainId,
        depositAddress: order.depositAddress,
      })
    } else if (order.status === 'FAILED') {
      firedRef.current.add(order.orderId)
      onError?.({
        code: order.substatus ?? 'ORDER_FAILED',
        message: `Funding order ${order.orderId} failed.`,
        provider: fundingSource ?? 'checkout',
      })
    }
  }, [order, onSuccess, onError, fundingSource])
}
```

Note: if the bare-context fallback trips `isolatedDeclarations` or lint, extract the same `NO_FLOW_STORE` stub pattern used by `useResumeKey.ts:15-22`.

- [ ] **Step 3: Run — expect pass; commit**

Run: `pnpm --filter @lifi/widget-checkout test useFundingOrderCompletion && pnpm --filter @lifi/widget-checkout check:types`

```bash
git add packages/widget-checkout/src/hooks/useFundingOrderCompletion.ts packages/widget-checkout/src/hooks/useFundingOrderCompletion.test.tsx
git commit -m "feat(checkout): fire onSuccess/onError from terminal order state"
```

---

### Task 5: Per-request exchange filter in `useRoutes`; delete the settings-store override hacks

**Files:**
- Modify: `packages/widget/src/hooks/useRoutes.ts` (options type + where the exchanges allow-list is assembled)
- Modify: `packages/widget-checkout/src/hooks/useCheckoutRoutes.ts`
- Delete: `packages/widget-checkout/src/hooks/useCheckoutExchangesOverride.ts`
- Modify: `packages/widget-checkout/src/providers/CheckoutAppProvider.tsx:44-60` (remove the exchanges fork; `effectiveWidgetConfig` becomes `widgetConfig`)
- Modify: `packages/widget-checkout/src/pages/SelectSourcePage/SelectSourcePage.tsx` (drop `overrideExchanges`/`restoreExchanges` calls at lines 174, 191, 211, 261)
- Modify: `packages/widget-checkout/src/pages/EnterAmountPage/` (drop its `useLayoutEffect` override re-assertion — grep `useCheckoutExchangesOverride` for the exact site)
- Test: extend `packages/widget/src/hooks/` tests if a useRoutes test exists (check first); otherwise cover via `useCheckoutRoutes` behavior in checkout tests

**Interfaces:**
- Consumes: existing `useRoutes(options)` in widget core (already accepts `{ quoteFromAddress, keepPreviousData }` — see `useCheckoutRoutes.ts:29`).
- Produces: `useRoutes` accepts `allowExchanges?: string[]`. When set, the request's `exchanges.allow` is exactly this list for this call, ignoring the settings store. `useCheckoutRoutes` gains the same optional param and passes it through. `INTENT_FACTORY_ONLY = ['smartDeposits']` moves to `packages/widget-checkout/src/utils/checkoutDefaults.ts`.

- [ ] **Step 1: Read the option seam**

Open `packages/widget/src/hooks/useRoutes.ts`. Find where the routes request assembles exchange filters from the settings store (search `enabledExchanges` / `exchanges`). Note the exact shape it feeds into the request (`allow`/`deny` arrays).

- [ ] **Step 2: Add the option**

In the `useRoutes` options interface add:

```ts
  /** Per-call exchange allow-list; overrides the settings-derived filter when set. */
  allowExchanges?: string[]
```

At the assembly site, apply:

```ts
  const effectiveAllowExchanges = options?.allowExchanges ?? settingsDerivedAllow
```

(using the actual local variable names found in Step 1) and include `options?.allowExchanges` in the query key so switching funding source refetches.

- [ ] **Step 3: Thread through `useCheckoutRoutes`**

```ts
export function useCheckoutRoutes(options?: {
  allowExchanges?: string[]
}): UseRoutesResult {
  ...
  return useRoutes({
    quoteFromAddress,
    keepPreviousData: true,
    allowExchanges: options?.allowExchanges,
  })
}
```

Callers pass `allowExchanges: fundingSource !== 'wallet' ? INTENT_FACTORY_ONLY : undefined` — the transfer/exchange pre-commit estimates still surface a smart-deposit route for display. Move the constant:

```ts
// checkoutDefaults.ts
export const INTENT_FACTORY_ONLY: readonly string[] = ['smartDeposits']
```

- [ ] **Step 4: Delete the two override mechanisms**

- Delete `useCheckoutExchangesOverride.ts`; fix every import (`SelectSourcePage`, `EnterAmountPage`).
- In `CheckoutAppProvider.tsx` remove lines 44-60 (the `effectiveWidgetConfig` memo) and pass `widgetConfig` directly to `WidgetProvider` and `OnRampProviderRegistry`.

- [ ] **Step 5: Verify + run the whole checkout suite**

Run: `pnpm --filter @lifi/widget-checkout test && pnpm --filter @lifi/widget check:types && pnpm --filter @lifi/widget-checkout check:types && pnpm check:write`
Expected: no remaining references (`grep -rn "useCheckoutExchangesOverride\|overrideExchanges\|restoreExchanges" packages/` returns nothing).

- [ ] **Step 6: Commit**

```bash
git add -u packages/widget/src packages/widget-checkout/src
git commit -m "refactor(checkout): per-request exchange filter replaces settings-store overrides"
```

---

### Task 6: Transfer flow → SMART_DEPOSIT order

**Files:**
- Modify: `packages/widget-checkout/src/components/CheckoutFlowCtaButton.tsx` (`handleTransferDeposit`, lines 94-101)
- Modify: `packages/widget-checkout/src/pages/TransferDepositPage/TransferDepositPage.tsx`
- Delete: `packages/widget-checkout/src/pages/TransferDepositPage/useTransferStatusPoll.ts`
- Test: `packages/widget-checkout/src/utils/buildOrderRequest.test.ts` already covers the request; add a page-level poll test only if straightforward — the poller itself is covered by Task 3.

**Interfaces:**
- Consumes: `createFundingOrder` from `@lifi/sdk`; `buildSmartDepositOrderRequest` (Task 3); `useFundingOrderStore.track` (Task 2); `useFundingOrder` (Task 3); `useSDKClient`.
- Produces: the transfer CTA creates the order and navigates to `transferDeposit` with `search: { orderId }`. `TransferDepositPage` reads `orderId` from search, renders `order.depositAddress` (top-level field — no probing), and navigates to the status route (`search: { orderId }`) once `order.substatus` leaves `INTENT_AWAITING_FUNDS` or the phase turns terminal.

- [ ] **Step 1: Rewrite `handleTransferDeposit`**

Replace lines 94-101 with an async mutation (use `useMutation` from TanStack Query for pending/error state):

```tsx
const createTransferOrder = useMutation({
  mutationFn: async () => {
    if (!route) {
      throw new Error('No route to derive the transfer request from.')
    }
    const order = await createFundingOrder(
      sdkClient,
      buildSmartDepositOrderRequest({
        toChainId: route.toChainId,
        toTokenAddress: route.toToken.address,
        toAddress: route.toAddress ?? route.fromAddress ?? '',
        fromChainId: route.fromChainId,
        fromTokenAddress: route.fromToken.address,
        fromAmount: route.fromAmount,
      })
    )
    return order
  },
  onSuccess: (order) => {
    trackOrder({
      orderId: order.orderId,
      fundingSource: 'transfer',
      createdAt: Date.now(),
    })
    navigate({
      to: checkoutNavigationRoutes.transferDeposit,
      search: { orderId: order.orderId },
    })
  },
})

const handleTransferDeposit = useCallback(() => {
  createTransferOrder.mutate()
}, [createTransferOrder])
```

`trackOrder` = `useFundingOrderStore((s) => s.track)`. Wire `createTransferOrder.isPending` into the button's disabled/loading state and surface `createTransferOrder.isError` with the existing try-again button pattern (lines 202-217). Remove the `freeze(route)` / `setFrozenRouteId` calls from this handler.

- [ ] **Step 2: Rewrite `TransferDepositPage`**

- Read `orderId` from route search (add it to the transfer-deposit route's `validateSearch` in `CheckoutRouter.tsx` the same way `transactionStatus` search params are declared).
- Replace `useFrozenQuote`/`extractDepositAddress`/`useTransferStatusPoll` with:

```tsx
const { orderId } = useSearch({ strict: false }) as { orderId?: string }
const { order, phase } = useFundingOrder(orderId ?? null)
const depositAddress = order?.depositAddress ?? null
const route = useMemo(
  () => (order?.quote ? convertOrderToRoute(order) : undefined),
  [order]
)

useEffect(() => {
  if (!order) {
    return
  }
  const fundsDetected =
    order.substatus !== undefined && order.substatus !== 'INTENT_AWAITING_FUNDS'
  if (phase === 'done' || phase === 'failed' || fundsDetected) {
    navigate({ to: statusPath, search: { orderId: order.orderId } })
  }
}, [order, phase, navigate])
```

`route` feeds the existing amount/symbol display (`route.fromToken`, `route.fromAmount` — same fields as today, lines 116-121). The QR renders `depositAddress`. Orders never expire server-side — delete the TTL countdown block and `DepositAddressExpiredPage` fallback for the missing-quote case; show the loading state until `order` arrives, and the deposit-error page only when `phase === 'failed'`.

- Delete `useTransferStatusPoll.ts` and the pending-record write block (lines 83-103).

- [ ] **Step 3: Run + commit**

Run: `pnpm --filter @lifi/widget-checkout test && pnpm --filter @lifi/widget-checkout check:types && pnpm check:write`

```bash
git add -u packages/widget-checkout/src
git commit -m "feat(checkout): transfer flow creates SMART_DEPOSIT funding orders"
```

---

### Task 7: Wallet flow → STANDARD order through the existing execution machinery

**Files:**
- Modify: `packages/widget-checkout/src/components/CheckoutFlowCtaButton.tsx` (`handleWalletDeposit`, lines 79-92)
- Modify: `packages/widget-checkout/src/pages/CheckoutTransactionPage.tsx` — delete `PendingCheckoutWalletHandoff` (lines 48-125) and its mount (lines 350-356)
- Test: keep the page compiling; the execution path itself is SDK-tested. Add `buildOrderRequest` coverage only if fields changed.

**Interfaces:**
- Consumes: `createFundingOrder`, `convertOrderToRoute` from `@lifi/sdk`; `buildStandardOrderRequest`; `useFundingOrderStore.track`; the route store's `setExecutableRoute` (used today in `useResumeCheckout.ts:43`).
- Produces: the wallet CTA creates a STANDARD order, converts it to the synthetic route (`route.id === orderId`), seeds the route store, and navigates to `/transaction-execution` with `search: { routeId: order.orderId, checkoutAutoDeposit: true }`. Everything downstream (auto-starter, `useRouteExecution`, `executeRoute`) runs unchanged — the SDK's funding branches activate off the step's `fundingOrderId` marker, report the txHash, and poll the order to terminal state inside the pipeline. The wallet status page is the order-status route (Task 9), reached with `orderId === routeId`.

**Why no `executeFundingOrder` call here:** `useRouteExecution` owns UI state (store writes, events, background handling). `executeRoute` on the order-derived route is exactly the STANDARD path of `executeFundingOrder` (same pipeline, same funding branches) — reusing it avoids duplicating the widget's execution-state plumbing.

- [ ] **Step 1: Rewrite `handleWalletDeposit`**

```tsx
const routeExecutionStore = useRouteExecutionStoreContext()

const createWalletOrder = useMutation({
  mutationFn: async () => {
    if (!route || !account.address) {
      throw new Error('No route or wallet for the deposit.')
    }
    return createFundingOrder(
      sdkClient,
      buildStandardOrderRequest({
        toChainId: route.toChainId,
        toTokenAddress: route.toToken.address,
        toAddress: route.toAddress ?? account.address,
        fromChainId: route.fromChainId,
        fromTokenAddress: route.fromToken.address,
        fromAmount: route.fromAmount,
        fromAddress: account.address,
      })
    )
  },
  onSuccess: (order) => {
    const orderRoute = convertOrderToRoute(order)
    routeExecutionStore.getState().setExecutableRoute(orderRoute)
    trackOrder({
      orderId: order.orderId,
      fundingSource: 'wallet',
      createdAt: Date.now(),
    })
    navigate({
      to: checkoutAbsolutePaths.transactionExecution,
      search: { routeId: order.orderId, checkoutAutoDeposit: true },
    })
    emitter.emit(WidgetEvent.RouteSelected, {
      route: orderRoute,
      routes: [orderRoute],
    })
  },
})

const handleWalletDeposit = useCallback(() => {
  createWalletOrder.mutate()
}, [createWalletOrder])
```

Imports: `useRouteExecutionStoreContext` from `@lifi/widget/shared` (grep its export name in `packages/widget/src/shared.ts` — `useResumeCheckout.ts:17` shows the exact specifier), `useAccount` from `@lifi/wallet-management` (already used elsewhere in checkout for the wallet flow — copy the pattern from `SelectSourcePage`). Surface `createWalletOrder.isPending/isError` on the CTA like Task 6. Remove `setReviewableRoute(route)` — the order route replaces the quoted display route.

- [ ] **Step 2: Delete the handoff**

In `CheckoutTransactionPage.tsx`: delete `PendingCheckoutWalletHandoff` (lines 48-125), its mount (lines 350-356), and now-unused imports (`stopRouteExecution`, `usePendingCheckoutWriter`, `useFrozenQuote`, `getSourceTxIdentifier`, `extractDepositAddress`, `FROZEN_QUOTE_TTL_MS`). Post-send tracking now happens inside the SDK pipeline; when execution completes/fails the page's existing `useRouteExecution` status handling shows it, and the status route (Task 9) covers reloads.

- [ ] **Step 3: Run + commit**

Run: `pnpm --filter @lifi/widget-checkout test && pnpm --filter @lifi/widget-checkout check:types && pnpm check:write`

```bash
git add -u packages/widget-checkout/src
git commit -m "feat(checkout): wallet flow executes STANDARD funding orders through the route machinery"
```

---

### Task 8: Cash and exchange flows → ONRAMP / SMART_DEPOSIT orders; hosts stop doing HTTP

**Files:**
- Modify: `packages/widget-provider/src/checkout/types.ts` — extend `OnRampOpenArgs` (lines 150-177)
- Modify: `packages/widget-provider-transak/src/TransakHost.tsx` — `openDepositFlow` (lines 85-213)
- Modify: `packages/widget-provider-mesh/src/MeshHost.tsx` — `openDepositFlow` (lines 116-202)
- Modify: `packages/widget-checkout/src/components/CheckoutFlowCtaButton.tsx` (`handleOnRampDeposit`, lines 103-155, and the cash gating at 180-221)
- Rewrite: `packages/widget-checkout/src/hooks/useOnRampQuote.ts`, `packages/widget-checkout/src/hooks/useOnRampFiatCurrencies.ts`
- Delete: `packages/widget-provider-mesh/src/useMeshBalance.ts` + its call site in `SelectSourcePage.tsx`
- Test: `packages/widget-checkout/src/hooks/useOnRampFiatCurrencies.test.ts` (normalizer over SDK shape)

**Interfaces:**
- Consumes: `createFundingOrder`, `createCexSession`, `getOnrampQuote`, `getOnrampFiatCurrencies` + their SDK types; `buildOnrampOrderRequest`, `buildSmartDepositOrderRequest`.
- Produces:
  - `OnRampOpenArgs` gains: `widgetUrl?: string` (Transak: pre-created by the ONRAMP order) and `linkToken?: string` (Mesh: pre-created CEX session). When present, the host **must not** call any HTTP endpoint.
  - `TransakHost.openDepositFlow`: if `args.widgetUrl` is set → `setWidgetUrl(args.widgetUrl); setOpen(true); setIsLoading(false); return` before any `postCheckoutSession` logic. The legacy path (no `widgetUrl`) is deleted along with the `postCheckoutSession` import — a missing `widgetUrl` sets `error {code:'INVALID_RESPONSE'}` like the missing-url branch today (lines 174-183).
  - `MeshHost.openDepositFlow`: same — `args.linkToken` replaces the `/v1/checkout/cex/session` call; the `createLink(...)` block (lines 204-350) is kept verbatim and receives `args.linkToken` at `link.openLink(...)`.
  - Cash CTA: `createFundingOrder(ONRAMP)` → track order → `onRampSession.open({ ..., widgetUrl: order.onramp?.widgetUrl })` → navigate to status with `{ orderId }`. Capture `order.onramp?.estimatedFundingAmount` into component state for display before navigating (create-response-only field).
  - Exchange CTA: `createFundingOrder(SMART_DEPOSIT)` (source = pinned USDC/ETH leg from the form, as today) + `createCexSession({ walletAddress: order.depositAddress!, tokenAddress, chainId, userId })` → `onRampSession.open({ ..., depositAddress: order.depositAddress!, linkToken })` → navigate to status with `{ orderId }`.
  - `useOnRampQuote`: same public result shape, `queryFn` becomes `getOnrampQuote(sdkClient, { tokenAddress, chainId, fiatAmount, fiatCurrency, paymentMethod })`. The SDK result already carries `funding.estimatedAmount` — the CTA gating keeps reading `data.funding.estimatedAmount`, but **delete the byte-exact route match gate** (lines 182-200): there is no client route for cash anymore. The cash CTA gates on `hasFiatAmount && onRampQuote.isReady` only.
  - `useOnRampFiatCurrencies`: `queryFn` becomes `getOnrampFiatCurrencies(sdkClient, { tokenAddress, chainId })`; the normalizer maps the SDK's `fiatCurrencies[{ symbol, isAllowed, paymentOptions[{ id, name, isActive }] }]` to the existing widget shape `currencies[{ currency, paymentOptions }]` (keep the current normalizer logic — it already reads `fiatCurrencies` keyed by `symbol`, lines 46-62; only the fetch changes).

- [ ] **Step 1: Extend `OnRampOpenArgs`** (append to the interface)

```ts
  /** Pre-created on-ramp widget URL (from the ONRAMP funding order). When set, the host mounts it directly and performs no HTTP. */
  widgetUrl?: string
  /** Pre-created CEX link token (from createCexSession). When set, the host opens it directly and performs no HTTP. */
  linkToken?: string
```

- [ ] **Step 2: Rewrite the two hosts' `openDepositFlow`** as specified in Interfaces. Delete the `postCheckoutSession` imports from both hosts. Keep every event handler, ref-mirror, and cleanup block untouched — with ONE exception: completion ownership moves to the order observer (spec §6.4), so delete the hosts' own `onSuccess` invocations:
  - `TransakHost.tsx` `onOrderSuccessful` (lines 282-339): keep the whole handler (runState bookkeeping, `setResolvedDepositAddress`, modal close) but remove the `onSuccessRef.current?.({...})` call and the now-unused `onSuccessRef` mirror (lines 68-71).
  - `MeshHost.tsx` `onTransferFinished` (lines 225-244): keep `transferSucceededRef`/`setDepositTxHash`; remove the `onSuccess({...})` call and drop `onSuccess` from the `useCallback` dep list (line 370).
  The Transak card-charge event therefore no longer fires the partner callback — the order observer (Task 4) fires it at on-chain settlement.

- [ ] **Step 3: Write the failing normalizer test** (`useOnRampFiatCurrencies.test.ts`): feed the exported normalizer the SDK shape and assert the widget shape:

```ts
import { describe, expect, it } from 'vitest'
import { normalizeFiatCurrencies } from './useOnRampFiatCurrencies.js'

describe('normalizeFiatCurrencies', () => {
  it('maps the SDK fiat-currencies shape to the widget shape', () => {
    const result = normalizeFiatCurrencies({
      cryptoCurrencyCode: 'USDC',
      network: 'ethereum',
      defaultCurrency: 'EUR',
      fiatCurrencies: [
        {
          symbol: 'EUR',
          name: 'Euro',
          isAllowed: true,
          isPopular: true,
          supportingCountries: [],
          paymentOptions: [
            { id: 'card', name: 'Card', isActive: true } as any,
            { id: 'sepa', name: 'SEPA', isActive: false } as any,
          ],
        },
        {
          symbol: 'XXX',
          name: 'X',
          isAllowed: false,
          isPopular: false,
          supportingCountries: [],
          paymentOptions: [],
        },
      ],
    } as any)
    expect(result.defaultCurrency).toBe('EUR')
    expect(result.currencies).toEqual([
      { currency: 'EUR', paymentOptions: [{ id: 'card', name: 'Card' }] },
    ])
  })
})
```

Export `normalizeFiatCurrencies` from the hook module and type its parameter as the SDK's `OnrampFiatCurrenciesResult`.

- [ ] **Step 4: Rewrite the CTA's `handleOnRampDeposit`** into two mutations (cash → `buildOnrampOrderRequest` with `fiatAmount: normalizedCashFiatAmount, fiatCurrency, paymentMethod`; exchange → `buildSmartDepositOrderRequest` from the displayed route + `createCexSession`), both ending in `trackOrder(...)`, `onRampSession.open({...})`, `navigate({ to: statusPath, search: { orderId } })`. Destination fields come from the widget config / route destination exactly as Tasks 6-7. Delete `freeze(...)`/`setFrozenRouteId` here too.

- [ ] **Step 5: Delete `useMeshBalance.ts`** and its `SelectSourcePage.tsx` call site (the insufficient-funds alert that can never fire).

- [ ] **Step 6: Run + commit**

Run: `pnpm --filter @lifi/widget-checkout test && pnpm --filter @lifi/widget-provider check:types && pnpm --filter @lifi/widget-provider-transak check:types && pnpm --filter @lifi/widget-provider-mesh check:types && pnpm --filter @lifi/widget-checkout check:types && pnpm check:write`
Expected: `grep -rn "postCheckoutSession" packages/widget-provider-transak packages/widget-provider-mesh` returns nothing.

```bash
git add -u packages/widget-provider/src packages/widget-provider-transak/src packages/widget-provider-mesh/src packages/widget-checkout/src
git commit -m "feat(checkout): cash and exchange flows run on funding orders; hosts stop doing HTTP"
```

---

### Task 9: Order-driven status page

**Files:**
- Create: `packages/widget-checkout/src/utils/orderStatusView.ts`
- Modify: `packages/widget-checkout/src/pages/CheckoutTransactionStatusPage/CheckoutTransactionStatusPage.tsx`
- Modify: `packages/widget-checkout/src/CheckoutRouter.tsx` (status route search: `{ orderId }`)
- Test: `packages/widget-checkout/src/utils/orderStatusView.test.ts`

**Interfaces:**
- Consumes: `useFundingOrder` (Task 3), `useFundingOrderCompletion` (Task 4), `useFundingOrderStore.acknowledge` (Task 2), `convertOrderToRoute` from `@lifi/sdk`.
- Produces:

```ts
export interface OrderStatusView {
  phase: 'watching' | 'pending' | 'done' | 'failed'
  substatus?: string
  toTxHash?: string
  toAmount?: string
  /** Display route derived from the committed quote; absent for DIRECT onramp. */
  displayRoute?: Route
  lateDelivery?: FundingOrderLateDelivery
}
export function orderStatusView(order: FundingOrder | undefined): OrderStatusView
```

Mapping: no order → `watching`; `PENDING` + `substatus === 'INTENT_AWAITING_FUNDS'` or `'ONRAMP_AWAITING_PAYMENT'` → `watching`; other `PENDING` → `pending`; `DONE` → `done`; `FAILED` → `failed`. `displayRoute` = `convertOrderToRoute(order)` guarded by `order.type === 'STANDARD' || Boolean(order.quote)` — wrap in try/catch and return `undefined` on throw (the adapter rejects non-STANDARD orders; for those, build the display object inline from `order.quote` via the same `convertQuoteToRoute` export).

- [ ] **Step 1: Write the failing view test**

```ts
import { describe, expect, it } from 'vitest'
import { orderStatusView } from './orderStatusView.js'

const base = {
  orderId: 'o',
  partnerOrderId: 'p',
  type: 'SMART_DEPOSIT',
  destination: { toChainId: 1, toTokenAddress: '0x1', toAddress: '0x2' },
  createdAt: '',
  updatedAt: '',
} as any

describe('orderStatusView', () => {
  it('is watching without an order', () => {
    expect(orderStatusView(undefined).phase).toBe('watching')
  })
  it('is watching while awaiting funds', () => {
    expect(
      orderStatusView({ ...base, status: 'PENDING', substatus: 'INTENT_AWAITING_FUNDS' }).phase
    ).toBe('watching')
  })
  it('is pending once the deposit is in flight', () => {
    expect(
      orderStatusView({ ...base, status: 'PENDING', substatus: 'WAIT_DESTINATION_TRANSACTION' }).phase
    ).toBe('pending')
  })
  it('exposes the result on done', () => {
    const view = orderStatusView({
      ...base,
      status: 'DONE',
      result: { toTxHash: '0xd', toAmount: '9' },
    })
    expect(view.phase).toBe('done')
    expect(view.toTxHash).toBe('0xd')
    expect(view.toAmount).toBe('9')
  })
  it('never throws on an unknown substatus', () => {
    expect(
      orderStatusView({ ...base, status: 'PENDING', substatus: 'SOME_FUTURE_VALUE' }).phase
    ).toBe('pending')
  })
})
```

- [ ] **Step 2: Implement the util**, run, pass.

- [ ] **Step 3: Rewire the status page**

- Status route search becomes `{ orderId?: string }` (declare in `CheckoutRouter.tsx`; drop `depositAddress`/`fromChain`/`transactionHash`/`taskId` search params — the page derives everything from the order; the wallet flow arrives with `orderId === routeId`).
- Page core:

```tsx
const { orderId } = useSearch({ strict: false }) as { orderId?: string }
const { order, isError, refetch } = useFundingOrder(orderId ?? null)
const view = orderStatusView(order)
useFundingOrderCompletion(order)
const acknowledge = useFundingOrderStore((s) => s.acknowledge)
```

- Keep the existing screens: `StatusWatching` for `watching`; `StatusExecuting` for `pending` (pass `frozenRoute={view.displayRoute}` and map `view.substatus` through the existing `resolveStatusVariant` copy where it expects a substatus); `StatusCompleted` for `done` (keep the `MIN_EXECUTING_MS` hold, lines 49-50/194-206); the failed branch keeps `CheckoutStatusScreen` with `resolveStatusVariant({ substatus: view.substatus, fundingSource })` and try-again → `goToEnterAmount` (retry = new order, per the backend's one-order-one-execution rule).
- On `done`/`failed` display acknowledgment (the Done button handler and the failed-screen primary action), call `acknowledge(orderId)`.
- Keep the on-ramp provider branches (`deposit?.failure` / `deposit?.error`, lines 268-302) — they cover pre-order provider failures and still work.
- Delete from the page: `useCheckoutTransactionStatus` usage, `extractStatusHints`, refund latching driven by `StatusResponse` (refund substatuses now arrive as order `substatus` strings — `REFUND_IN_PROGRESS`/`REFUNDED` map through `resolveStatusVariant` as before), `usePendingCheckoutWriter`/`useResumeKey` blocks (lines 123-192) — replaced by `acknowledge`.
- `lateDelivery`: when `view.lateDelivery` is set, render an informational caption under the status screen (`t('checkout.transactionStatus.lateDelivery', ...)` — add the i18n key to `packages/widget/src/i18n/en.json` `checkout.*` namespace); never treat it as a phase change.

- [ ] **Step 4: Run + commit**

Run: `pnpm --filter @lifi/widget-checkout test && pnpm --filter @lifi/widget-checkout check:types && pnpm check:write`

```bash
git add -u packages/widget-checkout/src packages/widget/src/i18n
git commit -m "feat(checkout): drive the status page from funding orders"
```

---

### Task 10: Activity + resume on the thin store

**Files:**
- Rewrite: `packages/widget-checkout/src/hooks/useCheckoutPendingRecords.ts` → `useCheckoutActivity.ts` (new name)
- Rewrite: `packages/widget-checkout/src/hooks/useResumeCheckout.ts`, `packages/widget-checkout/src/utils/pickAutoResumeItem.ts`
- Delete: `packages/widget-checkout/src/utils/buildResumeNavigation.ts`, `packages/widget-checkout/src/hooks/useResumeKey.ts`, `packages/widget-checkout/src/stores/usePendingCheckoutStore.ts`, `packages/widget-checkout/src/hooks/usePendingCheckoutWriter.ts`, `packages/widget-checkout/src/providers/PendingCheckoutPersistenceBridge.tsx` (and its mount in `CheckoutAppProvider.tsx:72/80`)
- Delete their test files; create: `packages/widget-checkout/src/hooks/useCheckoutActivity.test.tsx`, keep a rewritten `pickAutoResumeItem.test.ts`
- Test: as listed

**Interfaces:**
- Consumes: `listTrackedOrders`, `useFundingOrderStore` (Task 2); `getFundingOrder` from `@lifi/sdk`; `fundingOrderQueryKey`, `orderPhase` (Task 3).
- Produces:

```ts
export interface ActivityItem {
  orderId: string
  fundingSource: CheckoutFundingSource
  order: FundingOrder | undefined
  phase: OrderPhase | undefined
}
export function useCheckoutActivity(): ActivityItem[]  // useQueries fan-out over tracked ids
export function pickAutoResumeItem(items: ActivityItem[]): ActivityItem | null  // lone pending item
export function useResumeCheckout(): (item: ActivityItem) => void
```

Resume navigation collapses to two branches: `fundingSource === 'transfer'` and the order still `INTENT_AWAITING_FUNDS` → `transferDeposit` with `{ orderId }` (reopen the QR); everything else → the status route with `{ orderId }`. Wallet resume goes to the status route too — the order tracks server-side state; re-attaching an unsent local route is out (the SDK re-fetches the committed quote on resume, and an unsent order surfaces as `watching` with a retry path). Set `fundingSource` on the flow store before navigating (as `useResumeCheckout.ts:21-25` does today). Terminal orders in the activity list stay until acknowledged (tap → status page → Done acknowledges).

- [ ] **Step 1: Write the failing tests** — `useCheckoutActivity.test.tsx` mirrors Task 3's poller test (mock `getFundingOrder`, seed two tracked orders, assert both resolve with phases; `// @vitest-environment happy-dom`, QueryClient wrapper). `pickAutoResumeItem.test.ts` asserts: lone pending → returned; terminal-only → null; two pending → null.

- [ ] **Step 2: Implement** — `useCheckoutActivity` uses `useQueries` with per-order `fundingOrderQueryKey(orderId)` and `refetchInterval` mirroring Task 3 (terminal → false; else 10 s). Rewrite `pickAutoResumeItem`:

```ts
export function pickAutoResumeItem(items: ActivityItem[]): ActivityItem | null {
  const pending = items.filter((item) => item.phase === 'pending' || item.phase === undefined)
  return pending.length === 1 ? pending[0] : null
}
```

- [ ] **Step 3: Delete the old subsystem** — the files listed above plus every import site (`SelectSourcePage` activity cards read `useCheckoutActivity` now; update the card component props from `PendingRecord` display fields to `order.quote`-derived display via `convertOrderToRoute`/`order.destination`). Update `CheckoutAppProvider` (remove `PendingCheckoutPersistenceBridge`; `onSuccess` routing through it moves entirely to Task 4's observer).

- [ ] **Step 4: Run everything + commit**

Run: `pnpm --filter @lifi/widget-checkout test && pnpm --filter @lifi/widget-checkout check:types && pnpm check:write`
Expected: `grep -rn "usePendingCheckoutStore\|usePendingCheckoutWriter\|PendingCheckoutPersistenceBridge\|buildResumeNavigation\|useResumeKey" packages/widget-checkout/src` returns nothing.

```bash
git add -u packages/widget-checkout/src
git commit -m "refactor(checkout): activity and resume run on the thin order store"
```

---

### Task 11: Delete the dead layer (session client, status bypass, frozen quote, router subtree)

**Files:**
- Delete: `packages/widget-provider/src/checkout/utils/sessionClient.ts` (+ both test files), `packages/widget-provider/src/checkout/api.ts`, `packages/widget-checkout/src/providers/CheckoutSdkBridge.tsx`, `packages/widget-checkout/src/utils/depositAddressStatus.ts`, `packages/widget-checkout/src/utils/statusHints.ts`, `packages/widget-checkout/src/utils/getSourceTxIdentifier.ts`, `packages/widget-checkout/src/utils/extractDepositAddress.ts`, `packages/widget-checkout/src/types/checkoutRoute.ts`, `packages/widget-checkout/src/hooks/useCheckoutFlowQuote.ts`, `packages/widget-checkout/src/hooks/useFrozenQuote.tsx`, `packages/widget-checkout/src/hooks/useCheckoutTransactionStatus.ts` (+ tests of all deleted modules)
- Modify: `packages/widget-provider/src/checkout/index.ts` (drop deleted exports; `apiUrl` leaves `CheckoutContextValue` — nothing consumes it after the hosts stopped doing HTTP), `packages/widget-provider/src/checkout/types.ts` (remove `apiUrl` from `CheckoutContextValue`), `CheckoutAppProvider.tsx` (unwrap `CheckoutSdkBridge`), `packages/widget-checkout/src/utils/statusPolling.ts` (keep only what remains referenced — likely delete entirely), `useCheckoutFlowStore.tsx` (drop `frozenRouteId`/`frozenDepositId` state + setters), `CheckoutRouter.tsx` + `utils/navigationRoutes.ts` (delete the `routes` subtree, lines 88-120 + 157-164, `CheckoutRoutesPage`, the `/progress` route + `ProgressPage`, and the `routes`/`progress` entries)
- Modify: `EnterAmountPage` and any remaining `useCheckoutFlowQuote` consumers → `useCheckoutRoutes` for display + `extract nothing` (the CTA no longer needs a deposit address pre-commit; cash needs only the fiat quote)

**Interfaces:**
- Consumes: everything built in Tasks 2-10.
- Produces: zero references to the deleted modules; `grep -rn "postCheckoutSession\|/v1/checkout\|depositAddressStatus\|extractDepositAddress\|useFrozenQuote\|frozenRouteId" packages/ --include="*.ts" --include="*.tsx"` (excluding `dist/`) returns nothing.

- [ ] **Step 1: Delete file by file, fixing imports after each deletion** (the compiler is the checklist: `pnpm --filter @lifi/widget-checkout check:types` after each batch).

- [ ] **Step 2: Router cleanup** — remove the dead subtree and `/progress`; update `backButtonRoutes` (drop `routes`); keep `transferDeposit`, `depositError`, `selectCash`.

- [ ] **Step 3: Flow-store slim-down** — `CheckoutFlowState` keeps `fundingSource`, `selectedExchangeAccount`, `tokenSelected` (+ setters + reset). Fix `reset()` and every `frozenRouteId`/`frozenDepositId` reference (should be none after Tasks 6-10 — the grep proves it).

- [ ] **Step 4: Full gate + commit**

Run: `pnpm --filter @lifi/widget-checkout test && pnpm --filter @lifi/widget-provider test && pnpm --filter @lifi/widget check:types && pnpm --filter @lifi/widget-checkout check:types && pnpm --filter @lifi/widget-provider check:types && pnpm check:write`

```bash
git add -u packages/widget-checkout packages/widget-provider packages/widget/src
git commit -m "refactor(checkout): delete the legacy session client and status bypass layer"
```

---

### Task 12: Core deposit special-case audit, changeset, full verification

**Files:**
- Audit/modify: the 12 `'deposit'` sites in `packages/widget/src/` (list below)
- Create: `.changeset/funding-orders-checkout.md`
- Verify: workspace-wide

**The 12 sites** (verified against `origin/main`): `types/widget.ts:51` (`CustomMode`), `hooks/useRoutes.ts:156,165,413`, `AmountInput.tsx:162`, `SendAmountCard.tsx:71`, `SendToWalletButton.tsx:143`, `RouteCard.tsx:28`, `RoutesContent.tsx:56`, `Routes.tsx:47`, `TransactionReview.tsx:115`, `ReviewButton.tsx:67`, `MainPage.tsx:35`.

- [ ] **Step 1: Audit each site**

For each, decide with evidence: still needed by the checkout's remaining pre-commit display path (`useCheckoutRoutes` + `useRoutes` with `allowExchanges`) or by the wallet execution page? Rules:
- `useRoutes.ts:165` (`contractCallQuoteEnabled`) and `:413` (same-token guard skip): still required — the pre-commit smart-deposit display quote for transfer/exchange still runs through `useRoutes` in deposit mode. **Keep**, with a one-line comment naming the pre-commit display as the reason.
- Copy/title sites (`AmountInput`, `SendAmountCard`, `SendToWalletButton`, `RouteCard`, `RoutesContent`, `Routes`, `TransactionReview`, `ReviewButton`, `MainPage`): these style the checkout's embedded widget screens — **keep** (they are presentation for mode `deposit`, still active).
- `types/widget.ts:51`: keep (public config type).
Record the audit as a table in the commit message body. If any site turns out dead (nothing renders it in checkout flows anymore), delete it in this task.

- [ ] **Step 2: Write the changeset**

`.changeset/funding-orders-checkout.md`:

```md
---
'@lifi/widget': minor
'@lifi/widget-provider': minor
'@lifi/widget-provider-transak': minor
'@lifi/widget-provider-mesh': minor
---

Checkout runs on the unified funding-orders SDK surface. `useRoutes` accepts a per-request `allowExchanges` filter. `OnRampOpenArgs` gains `widgetUrl`/`linkToken`; the Transak and Mesh hosts no longer perform session HTTP. The checkout session client (`postCheckoutSession`) and its `/v1/checkout/*` types are removed from `@lifi/widget-provider/checkout`; `CheckoutContextValue.apiUrl` is removed. `onSuccess`/`onError` now fire on terminal funding-order state for all funding sources.
```

- [ ] **Step 3: Full verification**

```bash
pnpm --filter @lifi/widget-checkout test
pnpm --filter @lifi/widget-provider test
pnpm --filter @lifi/widget test
pnpm check && pnpm check:types
pnpm build
```

All green. Reminder: `pnpm-workspace.yaml`/`pnpm-lock.yaml` stay uncommitted (link markers).

- [ ] **Step 4: Commit**

```bash
git add .changeset/funding-orders-checkout.md packages/widget/src
git commit -m "chore(checkout): audit deposit-mode sites and add the release changeset"
```

---

## Live verification (operator step, after all tasks)

1. Run `lifi-backend` branch `funding-orders` locally.
2. `pnpm dev:local` (playground vite `--mode localhost`) with the playground config pointing `sdkConfig.apiUrl` at `http://localhost:3000/v1` (set it in the playground's checkout config; `VITE_CHECKOUT_INTEGRATOR` as needed) and the widget mode toggle set to `checkout`.
3. Wallet flow on a test chain: order created → pipeline executes → status page reaches Done → `onSuccess` fires (log it in the playground).
4. Transfer flow: QR shows `order.depositAddress`; fund it from another wallet; status transitions land.
5. Cash flow: Transak staging cards per `lifi-backend/docs/funding-api/funding-orders-e2e-test-plan.md`; verify `widgetUrl` mounts without any `/v1/checkout/*` request in the network tab.
6. Before opening the PR: `pnpm unlink:sdk`, repin `@lifi/sdk` to the published funding release (or a `release-preview` build), and re-run the Task 12 gate.
