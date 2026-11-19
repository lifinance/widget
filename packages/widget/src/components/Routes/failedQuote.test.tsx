/** @vitest-environment happy-dom */

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// A failed routes request (a 500, a rate limit) used to settle into "No routes
// available", which tells the user that nothing routes when nothing was
// checked. Every surface that shows the no-route state must tell the two apart.

const routesState = vi.fn()
const useWideVariant = vi.fn()

vi.mock('../../hooks/useRoutes.js', () => ({ useRoutes: () => routesState() }))
vi.mock('../../hooks/useWideVariant.js', () => ({
  useWideVariant: () => useWideVariant(),
}))
vi.mock('../../hooks/useToAddressRequirements.js', () => ({
  useToAddressRequirements: () => ({
    requiredToAddress: false,
    unsupportedReceiverBlocking: false,
  }),
}))
vi.mock('../../providers/WidgetProvider/WidgetProvider.js', () => ({
  useWidgetConfig: () => ({}),
}))
vi.mock('../../stores/form/useFieldValues.js', () => ({
  useFieldValues: () => ['', ''],
}))
vi.mock('../../stores/form/useFieldActions.js', () => ({
  useFieldActions: () => ({ setFieldValue: vi.fn() }),
}))
vi.mock('@lifi/wallet-management', () => ({
  useAccount: () => ({ account: { isConnected: false } }),
}))
vi.mock('@tanstack/react-router', () => ({ useNavigate: () => vi.fn() }))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
// Styled through `theme.vars`, which needs a themed provider this test has no
// reason to build.
vi.mock('../Card/Card.js', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
vi.mock('../Card/CardTitle.js', () => ({ CardTitle: () => null }))
vi.mock('../ButtonTertiary.js', () => ({ ButtonTertiary: () => null }))
vi.mock('../ProgressToNextUpdate.js', () => ({
  ProgressToNextUpdate: () => null,
}))
vi.mock('../PageContainer.js', () => ({
  PageContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))
vi.mock('./RoutesExpanded.style.js', () => ({
  Container: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Header: () => null,
}))
vi.mock('../Messages/QuoteFailedMessage.js', () => ({
  QuoteFailedMessage: () => <div data-testid="quote-failed" />,
}))
vi.mock('../RouteCard/RouteNotFoundCard.js', () => ({
  RouteNotFoundCard: () => <div data-testid="no-route-card" />,
}))
vi.mock('../RouteCard/RouteCard.js', () => ({
  RouteCard: () => <div data-testid="route-card" />,
}))
vi.mock('../RouteCard/RouteCardSkeleton.js', () => ({
  RouteCardSkeleton: () => <div data-testid="skeleton" />,
}))
vi.mock('../../hooks/useHeader.js', () => ({ useHeader: () => {} }))
vi.mock('../../hooks/useListHeight.js', () => ({
  useListHeight: () => ({ listHeight: 600 }),
}))
vi.mock('../../hooks/useWidgetEvents.js', () => ({
  useWidgetEvents: () => ({ emit: vi.fn() }),
}))
vi.mock('../../pages/RoutesPage/RoutesPage.style.js', () => ({
  Stack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
vi.mock('../RouteCard/RouteProviderCard.js', () => ({
  RouteProviderCard: () => <div data-testid="route-card" />,
  RouteProviderCardSkeleton: () => <div data-testid="skeleton" />,
}))

const { Routes } = await import('./Routes.js')
const { LimitOrderRoutes } = await import('./LimitOrderRoutes.js')
const { RoutesContent } = await import('./RoutesContent.js')
const { RoutesPage } = await import('../../pages/RoutesPage/RoutesPage.js')

const settled = {
  routes: [],
  issues: [],
  isLoading: false,
  isFetching: false,
  isFetched: true,
  isError: false,
  quoteFailed: false,
  dataUpdatedAt: 0,
  refetchTime: 60_000,
  refetch: () => {},
}

const states = {
  failed: { ...settled, routes: undefined, isError: true, quoteFailed: true },
  // The query keeps its error while it asks again, so the message must too.
  failedRefreshing: {
    ...settled,
    routes: undefined,
    isError: true,
    quoteFailed: true,
    isFetching: true,
  },
  noRoute: settled,
  // A 404 settles as an error too, but it is the API's answer.
  notFound: { ...settled, routes: undefined, isError: true },
  loading: { ...settled, routes: undefined, isLoading: true, isFetched: false },
}

type State = keyof typeof states

const surfaces = {
  'the swap card': (): React.ReactNode => <Routes />,
  'the limit form': (): React.ReactNode => <LimitOrderRoutes />,
  'the routes page': (): React.ReactNode => <RoutesPage />,
  'the wide side panel': (): React.ReactNode => {
    const state = routesState()
    return (
      <RoutesContent {...state} fromChain={undefined} onRouteClick={() => {}} />
    )
  },
}

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  useWideVariant.mockReturnValue(false)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.clearAllMocks()
})

const shown = (surface: keyof typeof surfaces, state: State): string[] => {
  routesState.mockReturnValue(states[state])
  const Surface = surfaces[surface]
  act(() => {
    root.render(<Surface />)
  })
  return [...container.querySelectorAll('[data-testid]')].map(
    (node) => node.getAttribute('data-testid') as string
  )
}

describe.each(Object.keys(surfaces) as (keyof typeof surfaces)[])(
  '%s',
  (surface) => {
    it.each([
      ['failed', 'quote-failed'],
      ['failedRefreshing', 'quote-failed'],
      ['noRoute', 'no-route-card'],
      ['notFound', 'no-route-card'],
    ] as [State, string][])(
      'shows %s as %s, and only that',
      (state, testId) => {
        expect(shown(surface, state)).toEqual([testId])
      }
    )

    it('shows the skeleton while a new quote loads', () => {
      expect(shown(surface, 'loading')).not.toContain('quote-failed')
      expect(shown(surface, 'loading')).toContain('skeleton')
    })
  }
)

// The panel carries the failure in the wide layout, as it carries the card.
it('leaves the failure to the side panel in the wide limit layout', () => {
  useWideVariant.mockReturnValue(true)
  expect(shown('the limit form', 'failed')).toEqual([])
})

// The panel keeps the last routes through its exit animation; they still win.
it('keeps routes that the side panel still shows', () => {
  routesState.mockReturnValue({
    ...states.failed,
    routes: [{ id: 'r1', steps: [] }],
  })
  act(() => {
    root.render(
      <RoutesContent
        {...routesState()}
        fromChain={undefined}
        onRouteClick={() => {}}
      />
    )
  })
  expect(container.querySelector('[data-testid="quote-failed"]')).toBe(null)
  expect(container.querySelector('[data-testid="route-card"]')).not.toBe(null)
})
