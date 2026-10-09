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
  StartTransactionButton: ({ text }: { text?: string }) => (
    <button type="button">{text}</button>
  ),
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

const failedExecution = (code: LiFiErrorCode) => ({
  status: 'FAILED',
  startedAt: 0,
  actions: [{ type: 'SWAP', status: 'FAILED', error: { code, message: '' } }],
})

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
  execution: failedExecution(LiFiErrorCode.CallBundleNotFound),
} as unknown as LiFiStepExtended

const route = {
  id: 'r1',
  fromChainId: 1,
  fromToken: step.action.fromToken,
  fromAmount: step.action.fromAmount,
  fromAddress: SENDER,
  toChainId: 8453,
  toToken: step.action.toToken,
  toAddress: SENDER,
  fromAmountUSD: '1',
  toAmountUSD: '1',
  steps: [step],
} as unknown as RouteExtended

const SOLANA_RECEIVER = 'So1anaReceiver11111111111111111111111111111'
const routeToSolana = {
  ...route,
  toChainId: 1151111081099710,
  toAddress: SOLANA_RECEIVER,
  steps: [
    {
      ...step,
      action: {
        ...step.action,
        toChainId: 1151111081099710,
        toAddress: SOLANA_RECEIVER,
      },
    },
  ],
} as unknown as RouteExtended

const routeFailedWith = (code: LiFiErrorCode) =>
  ({
    ...route,
    steps: [{ ...step, execution: failedExecution(code) }],
  }) as unknown as RouteExtended

// The first step is done, so a new swap would send its funds again.
const routeFailedInLaterStep = {
  ...route,
  steps: [
    {
      ...step,
      execution: {
        status: 'DONE',
        startedAt: 0,
        actions: [{ type: 'SWAP', status: 'DONE', txHash: '0xhash' }],
      },
    },
    { ...step, id: 'step-1' },
  ],
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
  config: Partial<WidgetContextProps> = {},
  testRoute: RouteExtended = route
) => {
  routeState.store = create<TestRouteState>((set) => ({
    route: testRoute,
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

const deleteButton = () =>
  [...container.querySelectorAll('button')].find(
    (button) => button.textContent === 'button.delete'
  )

// The mocks leave only the failed-route buttons on the page.
const buttonTexts = () =>
  [...container.querySelectorAll('button')].map((button) => button.textContent)

const field = (name: 'fromAmount' | 'toAmount' | 'toAddress' | 'fromToken') =>
  formStore.getState().userValues[name]?.value

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

describe('The buttons of a failed route', () => {
  it('should offer Delete and a new swap, and no retry, when the wallet has no record of the bundle', async () => {
    await render(RouteExecutionStatus.Failed)
    await waitFor(() => buttonTexts().length > 0)

    expect(buttonTexts()).toEqual(['button.delete', 'button.startNewSwap'])
  })

  it('should offer only Delete when the wallet has no record of the bundle and a new swap is not possible', async () => {
    await render(RouteExecutionStatus.Failed, {}, routeFailedInLaterStep)
    await waitFor(() => buttonTexts().length > 0)

    expect(buttonTexts()).toEqual(['button.delete'])
  })

  it('should offer Delete and a retry for other errors', async () => {
    await render(
      RouteExecutionStatus.Failed,
      {},
      routeFailedWith(LiFiErrorCode.SignatureRejected)
    )
    await waitFor(() => buttonTexts().length > 0)

    expect(buttonTexts()).toEqual(['button.delete', 'button.tryAgain'])
  })

  it('should delete the route and not fill the form when Delete is clicked', async () => {
    await render(RouteExecutionStatus.Failed)
    await waitFor(() => !!newSwapButton())

    deleteButton()!.click()

    await waitFor(() => !!container.querySelector('#home'))
    await sleep(300)
    expect(testRouteState().status).toBeUndefined()
    expect(field('fromAmount')).toBeFalsy()
  })
})

describe('Start a new swap and the transaction page cleanup', () => {
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

    it(`should fill the route's receiver when the form has none with ${JSON.stringify(config)}`, async () => {
      await render(RouteExecutionStatus.Failed, config, routeToSolana)
      await waitFor(() => !!newSwapButton())

      newSwapButton()!.click()

      await waitFor(() => !!container.querySelector('#home'))
      await sleep(300)
      expect(field('fromAmount')).toBe('1.5')
      expect(field('toAddress')).toBe(SOLANA_RECEIVER)
    })
  }
})

function testRouteState(): TestRouteState {
  return testRouteStore().getState()
}
