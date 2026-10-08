/** @vitest-environment happy-dom */

import {
  QueryClient,
  QueryClientProvider,
  QueryObserver,
} from '@tanstack/react-query'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { RouteIssueCardContent } from '../utils/routeIssues/card.js'
import type { RouteIssue } from '../utils/routeIssues/types.js'
import { useRouteIssueCard } from './useRouteIssueCard.js'

// The pure builder is covered on its own; what is left here is the wiring from
// each button to the store or query it has to reach.

const mocks = vi.hoisted(() => ({
  config: { mode: 'default', storageScopeKey: 'test' } as Record<
    string,
    unknown
  >,
  setFieldValue: vi.fn(),
  setSendAmount: vi.fn(),
  setSelectedBookmark: vi.fn(),
  balance: { token: {}, isLoading: false } as Record<string, unknown>,
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
vi.mock('../providers/WidgetProvider/WidgetProvider.js', () => ({
  useWidgetConfig: () => mocks.config,
}))
vi.mock('../stores/form/useFieldValues.js', () => ({
  useFieldValues: () => [1, '0xusdc', 10, '0xreceiver'],
}))
vi.mock('../stores/form/useFieldActions.js', () => ({
  useFieldActions: () => ({ setFieldValue: mocks.setFieldValue }),
}))
vi.mock('../stores/bookmarks/useBookmarkActions.js', () => ({
  useBookmarkActions: () => ({
    setSelectedBookmark: mocks.setSelectedBookmark,
  }),
}))
vi.mock('../stores/settings/useSettings.js', () => ({
  useSettings: () => ({ slippage: '0.5' }),
}))
vi.mock('../stores/settings/useSettingsActions.js', () => ({
  useSettingsActions: () => ({ setValue: vi.fn() }),
}))
vi.mock('./useLinkedLimitFields.js', () => ({
  useLinkedLimitFields: () => ({ setSendAmount: mocks.setSendAmount }),
}))
vi.mock('./useToken.js', () => ({
  useToken: () => ({
    token: { symbol: 'USDC', decimals: 6, priceUSD: '1', address: '0xusdc' },
  }),
}))
vi.mock('./useChain.js', () => ({
  useChain: (chainId: number) => ({ chain: { id: chainId, chainType: 'EVM' } }),
}))
vi.mock('./useMaxSendAmount.js', () => ({
  useMaxSendAmount: () =>
    (mocks.balance.token as { amount?: bigint }).amount ?? 0n,
}))
vi.mock('./useTokenAddressBalance.js', () => ({
  useTokenAddressBalance: () => mocks.balance,
}))
vi.mock('./useToAddressRequirements.js', () => ({
  useToAddressRequirements: () => ({
    requiredToAddress: false,
    unsupportedReceiverBlocking: false,
  }),
}))

// 2 USDC stated, buffered and rounded clear of it: the button writes 2.1.
const tooLow: RouteIssue = {
  bucket: 'amountTooLow',
  ruleId: 'test',
  fromAmount: 1_000n,
  evidence: { requiredFromAmount: 2_000_000n, direction: 'raise' },
}

const withBucket = (bucket: RouteIssue['bucket']): RouteIssue => ({
  bucket,
  ruleId: 'test',
  fromAmount: 1_000n,
})

let client: QueryClient
let container: HTMLDivElement
let root: Root
let card: RouteIssueCardContent | undefined

const Probe = ({ issue }: { issue: RouteIssue }): null => {
  card = useRouteIssueCard(issue)
  return null
}

const press = (issue: RouteIssue): void => {
  act(() => {
    root.render(
      <QueryClientProvider client={client}>
        <Probe issue={issue} />
      </QueryClientProvider>
    )
  })
  expect(card?.action).toBeDefined()
  act(() => {
    card?.action?.run()
  })
}

beforeEach(() => {
  mocks.balance = { token: {}, isLoading: false }
  mocks.config = { mode: 'default', storageScopeKey: 'test' }
  vi.clearAllMocks()
  client = new QueryClient()
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  client.clear()
})

describe('applying an amount', () => {
  it('writes the send field and skips the typing debounce', () => {
    press(tooLow)
    expect(mocks.setFieldValue).toHaveBeenCalledWith('fromAmount', '2.1', {
      isTouched: true,
      immediate: true,
    })
    expect(mocks.setSendAmount).not.toHaveBeenCalled()
  })

  // A bare field write in limit mode leaves the receive amount derived from the
  // old send amount, and the quote pairs the new amount with a stale limit.
  it('goes through the linked limit fields in limit mode', () => {
    mocks.config.mode = 'limit'
    press(tooLow)
    expect(mocks.setSendAmount).toHaveBeenCalledWith('2.1', true)
    expect(mocks.setFieldValue).not.toHaveBeenCalled()
  })
})

// Left behind, the bookmark keeps the removed recipient's name on the receiver
// card, and its chainType can satisfy the guard that resets a stale address.
it('clears the receiver and its bookmark together', () => {
  press(withBucket('recipientNotSupported'))
  expect(mocks.setFieldValue).toHaveBeenCalledWith('toAddress', '', {
    isTouched: true,
  })
  expect(mocks.setSelectedBookmark).toHaveBeenCalledTimes(1)
  expect(mocks.setSelectedBookmark).toHaveBeenCalledWith()
})

// Every routes query shares the prefix, whatever the rest of its key holds, so
// a retry has to reach them all and leave the other queries alone.
it('retries by invalidating every routes query and nothing else', () => {
  client.setQueryData(['test-widget-routes', '0xfrom', 1], { routes: [] })
  client.setQueryData(['test-widget-routes', '0xother', 10], { routes: [] })
  client.setQueryData(['test-widget-tokens'], [])
  press(withBucket('temporary'))
  expect(
    client.getQueryState(['test-widget-routes', '0xfrom', 1])?.isInvalidated
  ).toBe(true)
  expect(
    client.getQueryState(['test-widget-routes', '0xother', 10])?.isInvalidated
  ).toBe(true)
  expect(client.getQueryState(['test-widget-tokens'])?.isInvalidated).toBe(
    false
  )
})

// The routes query is keyed on the resolved storage scope, which wins over the
// deprecated `keyPrefix`. Keyed on the prefix, a retry reached no query at all
// once an integrator set both.
it('retries the routes query under its storage scope, not the old prefix', () => {
  mocks.config = { mode: 'default', keyPrefix: 'old', storageScopeKey: 'test' }
  client.setQueryData(['test-widget-routes', '0xfrom', 1], { routes: [] })
  press(withBucket('temporary'))
  expect(
    client.getQueryState(['test-widget-routes', '0xfrom', 1])?.isInvalidated
  ).toBe(true)
})

// Each press invalidated afresh, and an invalidation cancels a refetch in flight
// to start another: two presses 80 ms apart sent two quote requests.
it('sends one request for two quick presses of retry', async () => {
  let requests = 0
  const observer = new QueryObserver(client, {
    queryKey: ['test-widget-routes', '0xfrom'],
    queryFn: () => {
      requests++
      return new Promise((resolve) =>
        setTimeout(() => resolve({ routes: [] }), 50)
      )
    },
  })
  const unsubscribe = observer.subscribe(() => {})
  await vi.waitFor(() =>
    expect(observer.getCurrentResult().isFetched).toBe(true)
  )
  expect(requests).toBe(1)

  press(withBucket('temporary'))
  act(() => {
    card?.action?.run()
  })
  await vi.waitFor(() =>
    expect(observer.getCurrentResult().isFetching).toBe(false)
  )
  expect(requests).toBe(2)
  unsubscribe()
})

describe('the amount button and the wallet balance', () => {
  const show = (): void => {
    act(() => {
      root.render(
        <QueryClientProvider client={client}>
          <Probe issue={tooLow} />
        </QueryClientProvider>
      )
    })
  }

  // Reported in QA: an empty wallet kept the button that a wallet holding a
  // little less than the suggestion lost.
  it('withdraws it for an empty wallet', () => {
    mocks.balance = { token: { amount: 0n }, isLoading: false }
    show()
    expect(card?.action).toBeUndefined()
  })

  it('keeps it while the balance is unknown', () => {
    mocks.balance = { token: {}, isLoading: false }
    show()
    expect(card?.action).toBeDefined()
  })

  it('keeps it while the balance is still loading', () => {
    mocks.balance = { token: { amount: 0n }, isLoading: true }
    show()
    expect(card?.action).toBeDefined()
  })
})
