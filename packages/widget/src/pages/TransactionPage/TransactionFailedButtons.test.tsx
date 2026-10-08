/** @vitest-environment happy-dom */

import {
  LiFiErrorCode,
  type LiFiStepExtended,
  type RouteExtended,
} from '@lifi/sdk'
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { create, type StoreApi, type UseBoundStore } from 'zustand'
import type { WidgetContextProps } from '../../providers/WidgetProvider/types.js'
import { WidgetContext } from '../../providers/WidgetProvider/WidgetProvider.js'
import { BookmarkStoreProvider } from '../../stores/bookmarks/BookmarkStore.js'
import type { Bookmark } from '../../stores/bookmarks/types.js'
import { useBookmarkActions } from '../../stores/bookmarks/useBookmarkActions.js'
import { useBookmarks } from '../../stores/bookmarks/useBookmarks.js'
import { createFormStore } from '../../stores/form/createFormStore.js'
import { FormStoreContext } from '../../stores/form/FormStoreContext.js'
import type { FormStoreStore } from '../../stores/form/types.js'
import { RouteExecutionStatus } from '../../stores/routes/types.js'

// Real page, buttons, router, form store and pacing; only wallet, SDK and theme leaves are stubbed.

const SENDER = '0x1111111111111111111111111111111111111111'

interface TestRouteState {
  route: RouteExtended
  status: RouteExecutionStatus | undefined
  setStatus: (status: RouteExecutionStatus) => void
  deleteRoute: () => void
}

type TestRouteStore = UseBoundStore<StoreApi<TestRouteState>>

const { routeState } = vi.hoisted(() => ({
  routeState: { store: undefined as unknown },
}))
const testRouteStore = () => routeState.store as TestRouteStore
const useTestRoute = <T,>(selector: (state: TestRouteState) => T): T =>
  testRouteStore()(selector)

vi.mock('../../hooks/useRouteExecution.js', () => ({
  useRouteExecution: () => {
    const { route, status, deleteRoute } = useTestRoute((state) => state)
    return {
      route: status ? route : undefined,
      status,
      deleteRoute,
      executeRoute: () => {},
      restartRoute: () => {},
    }
  },
}))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
vi.mock('../../hooks/useHeader.js', () => ({ useHeader: () => {} }))
vi.mock('../../hooks/useAddressActivity.js', () => ({
  useAddressActivity: () => ({
    toAddress: undefined,
    hasActivity: true,
    isLoading: false,
    isFetched: true,
  }),
}))
vi.mock('../../hooks/useSwapOnly.js', () => ({ useSwapOnly: () => false }))
vi.mock('../../components/PageContainer.js', () => ({
  PageContainer: ({ children }: { children?: ReactNode }) => children,
}))
vi.mock('./RouteTracker.js', () => ({ RouteTracker: () => null }))
vi.mock('./ExchangeRateBottomSheet.js', () => ({
  ExchangeRateBottomSheet: () => null,
}))
vi.mock('./StartTransactionButton.js', () => ({
  StartTransactionButton: () => null,
}))
vi.mock('./TokenValueBottomSheet.js', () => ({
  TokenValueBottomSheet: () => null,
}))
vi.mock('./ConfirmToAddressSheet.js', () => ({
  ConfirmToAddressSheet: () => null,
}))
vi.mock('./TransactionContent.js', async () => {
  const { TransactionFailedButtons } = await import(
    './TransactionFailedButtons.js'
  )
  return {
    TransactionContent: ({
      route,
      status,
      restartRoute,
      deleteRoute,
    }: {
      route: RouteExtended
      status: RouteExecutionStatus
      restartRoute: () => void
      deleteRoute: () => void
    }) =>
      status === RouteExecutionStatus.Failed ? (
        <TransactionFailedButtons
          route={route}
          restartRoute={restartRoute}
          deleteRoute={deleteRoute}
        />
      ) : null,
  }
})

const { TransactionPage } = await import('./TransactionPage.js')

const step = {
  id: 'step-0',
  action: {
    fromChainId: 1,
    fromAmount: '1500000',
    fromToken: { address: '0xfrom', decimals: 6, chainId: 1 },
    fromAddress: SENDER,
    toChainId: 8453,
    toToken: { address: '0xto', decimals: 6, chainId: 8453 },
    toAddress: SENDER,
  },
  estimate: { gasCosts: [], feeCosts: [] },
  execution: {
    status: 'FAILED',
    startedAt: 0,
    actions: [
      {
        type: 'SWAP',
        status: 'FAILED',
        error: { code: LiFiErrorCode.CallBundleNotFound, message: '' },
      },
    ],
  },
} as unknown as LiFiStepExtended

const route = {
  id: 'r1',
  fromChainId: 1,
  toChainId: 8453,
  fromAmountUSD: '1',
  toAmountUSD: '1',
  steps: [step],
} as unknown as RouteExtended

let formStore: FormStoreStore
let bookmarks: {
  selected?: Bookmark
  select?: (bookmark?: Bookmark) => void
}

const BookmarkProbe = (): null => {
  const { selectedBookmark } = useBookmarks()
  const { setSelectedBookmark } = useBookmarkActions()
  bookmarks.selected = selectedBookmark
  bookmarks.select = setSelectedBookmark
  return null
}

const makeRouter = () => {
  const rootRoute = createRootRoute({
    component: () => (
      <>
        <BookmarkProbe />
        <Outlet />
      </>
    ),
  })
  const home = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <div id="home" />,
  })
  const transaction = createRoute({
    getParentRoute: () => rootRoute,
    path: '/transaction-execution',
    component: TransactionPage,
  })
  return createRouter({
    routeTree: rootRoute.addChildren([home, transaction]),
    history: createMemoryHistory({
      initialEntries: ['/', '/transaction-execution?routeId=r1'],
    }),
  })
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const waitFor = async (check: () => boolean) => {
  for (let i = 0; i < 100 && !check(); i++) {
    await sleep(20)
  }
  expect(check()).toBe(true)
}

let container: HTMLDivElement
let root: Root
let router: ReturnType<typeof makeRouter>

const render = async (
  status: RouteExecutionStatus,
  config: Partial<WidgetContextProps> = {}
) => {
  routeState.store = create<TestRouteState>((set) => ({
    route,
    status,
    setStatus: (status) => set({ status }),
    deleteRoute: () => set({ status: undefined }),
  }))
  router = makeRouter()
  root.render(
    <WidgetContext
      value={
        { elementId: '', integrator: '', mode: 'default', ...config } as never
      }
    >
      <FormStoreContext value={formStore}>
        <BookmarkStoreProvider namePrefix="test">
          <RouterProvider router={router} />
        </BookmarkStoreProvider>
      </FormStoreContext>
    </WidgetContext>
  )
  await waitFor(
    () =>
      router.state.status === 'idle' &&
      router.state.location.pathname === '/transaction-execution'
  )
}

const newSwapButton = () =>
  [...container.querySelectorAll('button')].find(
    (button) => button.textContent === 'button.startNewSwap'
  )

const field = (name: 'fromAmount' | 'toAmount' | 'toAddress' | 'fromToken') =>
  formStore.getState().userValues[name]?.value

describe('Start a new swap and the transaction page cleanup', () => {
  beforeEach(() => {
    ;(
      globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = false
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    formStore = createFormStore()
    bookmarks = {}
  })

  afterEach(() => {
    root.unmount()
    container.remove()
    localStorage.clear()
    vi.restoreAllMocks()
  })

  // Within the 1.2 s pacing window the page still holds the failed status when it unmounts.
  it('should keep the filled amount when the route failed just before the click', async () => {
    await render(RouteExecutionStatus.Pending)
    formStore.getState().setFieldValue('toAmount', '7')
    testRouteState().setStatus(RouteExecutionStatus.Failed)
    await waitFor(() => !!newSwapButton())

    newSwapButton()!.click()

    await waitFor(() => !!container.querySelector('#home'))
    await sleep(1500)
    expect(router.state.location.pathname).toBe('/')
    expect(field('fromAmount')).toBe('1.5')
    expect(field('fromToken')).toBe('0xfrom')
    expect(field('toAmount')).toBe('')
  })

  it('should keep the filled amount for a route that had already failed', async () => {
    await render(RouteExecutionStatus.Failed)
    await waitFor(() => !!newSwapButton())
    await sleep(1300)

    newSwapButton()!.click()

    await waitFor(() => !!container.querySelector('#home'))
    await sleep(1500)
    expect(field('fromAmount')).toBe('1.5')
    expect(field('toAddress')).toBe('')
  })

  it('should clear the receiver and the bookmark when the receiver is open to change', async () => {
    await render(RouteExecutionStatus.Failed)
    await waitFor(() => !!newSwapButton() && !!bookmarks.select)
    formStore.getState().setFieldValue('toAddress', '0xold')
    bookmarks.select?.({
      name: 'Old',
      address: '0xold',
      chainType: 'EVM',
    } as Bookmark)

    newSwapButton()!.click()

    await waitFor(() => !!container.querySelector('#home'))
    await sleep(300)
    expect(field('toAddress')).toBe('')
    expect(bookmarks.selected).toBeUndefined()
  })

  for (const config of [
    { hiddenUI: { toAddress: true } },
    { disabledUI: { toAddress: true } },
  ]) {
    it(`should keep the integrator's receiver and bookmark with ${JSON.stringify(config)}`, async () => {
      await render(RouteExecutionStatus.Failed, config)
      await waitFor(() => !!newSwapButton() && !!bookmarks.select)
      formStore.getState().setFieldValue('toAddress', '0xlocked')
      const locked = {
        name: 'Locked',
        address: '0xlocked',
        chainType: 'EVM',
      } as Bookmark
      bookmarks.select?.(locked)

      newSwapButton()!.click()

      await waitFor(() => !!container.querySelector('#home'))
      await sleep(300)
      expect(field('fromAmount')).toBe('1.5')
      expect(field('toAddress')).toBe('0xlocked')
      expect(bookmarks.selected).toEqual(locked)
    })
  }
})

function testRouteState(): TestRouteState {
  return testRouteStore().getState()
}
