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

vi.mock('@tanstack/react-router', () => ({
  useLocation: () => ({ pathname: '/' }),
  useRouter: () => ({ history: { length: 1, go: () => {} } }),
  useNavigate: () => () => {},
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
        value={{ closeModal, openCloseConfirmation, panelEl: null }}
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
