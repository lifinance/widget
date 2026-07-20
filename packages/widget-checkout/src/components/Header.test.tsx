// @vitest-environment happy-dom

import type { OnRampSession } from '@lifi/widget-provider/checkout'
import {
  createOnRampSessionsStore,
  OnRampSessionsContext,
  type OnRampSessionsStore,
} from '@lifi/widget-provider/checkout'
import { fireEvent, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckoutModalContext } from '../CheckoutModal.js'
import { renderWithI18n } from '../test/renderWithI18n.js'

vi.mock('@lifi/widget/shared', () => ({
  createElementId: (id: string) => id,
  ElementId: { Header: 'header' },
  navigationRoutes: { transactionExecution: 'transaction-execution' },
  useHeaderStore: (selector: (s: { title: string | null }) => unknown) =>
    selector({ title: null }),
  useSetHeaderHeight: () => ({ setHeaderHeight: () => {} }),
  useWidgetConfig: () => ({ elementId: 'test' }),
}))

const { navigateMock, routerGo, routerState } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  routerGo: vi.fn(),
  routerState: { pathname: '/', historyLength: 1 },
}))

vi.mock('@tanstack/react-router', () => ({
  useLocation: () => ({ pathname: routerState.pathname }),
  useRouter: () => ({
    history: { length: routerState.historyLength, go: routerGo },
  }),
  useNavigate: () => navigateMock,
}))

vi.mock('@lifi/wallet-management', () => ({
  useAccount: () => ({ accounts: [] }),
}))

import { Header } from './Header.js'

function makeSession(isOpen: boolean): OnRampSession {
  return {
    isOpen,
    isLoading: false,
    error: null,
    failure: null,
    depositTxHash: null,
    open: () => {},
    close: () => {},
    acknowledgeDepositTxHash: () => {},
    mountTargetId: null,
  } as unknown as OnRampSession
}

function setup({
  busy,
  closeModal,
  openCloseConfirmation,
}: {
  busy: boolean
  closeModal: () => void
  openCloseConfirmation: () => void
}) {
  const store: OnRampSessionsStore = createOnRampSessionsStore()
  if (busy) {
    store.getState().register('s1', makeSession(true))
  }
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <OnRampSessionsContext.Provider value={store}>
      <CheckoutModalContext.Provider
        value={{
          closeModal,
          openCloseConfirmation,
          panelEl: null,
          inline: false,
        }}
      >
        {children}
      </CheckoutModalContext.Provider>
    </OnRampSessionsContext.Provider>
  )
  return renderWithI18n(<Header />, { wrapper: Wrapper })
}

describe('Header close button', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    routerState.pathname = '/'
    routerState.historyLength = 1
  })

  it('calls closeModal directly when idle', () => {
    const closeModal = vi.fn()
    const openCloseConfirmation = vi.fn()
    setup({ busy: false, closeModal, openCloseConfirmation })
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(closeModal).toHaveBeenCalledTimes(1)
    expect(openCloseConfirmation).not.toHaveBeenCalled()
  })

  it('opens the confirmation dialog when busy', () => {
    const closeModal = vi.fn()
    const openCloseConfirmation = vi.fn()
    setup({ busy: true, closeModal, openCloseConfirmation })
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(openCloseConfirmation).toHaveBeenCalledTimes(1)
    expect(closeModal).not.toHaveBeenCalled()
  })
})

describe('Header back button', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    routerState.pathname = '/'
    routerState.historyLength = 1
  })

  it('confirms before abandoning to home from the transfer-deposit page', () => {
    routerState.pathname = '/transfer-deposit'
    setup({
      busy: false,
      closeModal: vi.fn(),
      openCloseConfirmation: vi.fn(),
    })
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    // Back opens the confirmation sheet; nothing navigates yet.
    expect(navigateMock).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Cancel transfer' }))
    expect(navigateMock).toHaveBeenCalledWith({ to: '/', replace: true })
    expect(routerGo).not.toHaveBeenCalled()
  })

  it('hides the back button on status pages', () => {
    routerState.pathname = '/transaction-execution/transaction-status'
    setup({
      busy: false,
      closeModal: vi.fn(),
      openCloseConfirmation: vi.fn(),
    })
    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull()
  })
})
