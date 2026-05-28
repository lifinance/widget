// @vitest-environment happy-dom

import type { OnRampSession } from '@lifi/widget-provider/checkout'
import {
  createOnRampSessionsStore,
  OnRampSessionsContext,
  type OnRampSessionsStore,
} from '@lifi/widget-provider/checkout'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@lifi/wallet-management', () => ({
  useAccount: () => ({ accounts: [] }),
}))

import { CheckoutModal, useCheckoutModal } from './CheckoutModal.js'
import { renderWithI18n } from './test/renderWithI18n.js'

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

function withProvider(store: OnRampSessionsStore) {
  return ({ children }: { children: ReactNode }) => (
    <OnRampSessionsContext.Provider value={store}>
      {children}
    </OnRampSessionsContext.Provider>
  )
}

function TriggerConfirmation() {
  const ctx = useCheckoutModal()
  return (
    <button type="button" onClick={() => ctx?.openCloseConfirmation()}>
      trigger-confirm
    </button>
  )
}

describe('CheckoutModal close guard', () => {
  it('ignores backdrop clicks while busy', () => {
    const store = createOnRampSessionsStore()
    store.getState().register('s1', makeSession(true))
    const onClose = vi.fn()
    renderWithI18n(
      <CheckoutModal open={true} onClose={onClose}>
        <div>checkout body</div>
      </CheckoutModal>,
      { wrapper: withProvider(store) }
    )
    const backdrop = document.querySelector('.MuiBackdrop-root')
    expect(backdrop).not.toBeNull()
    fireEvent.click(backdrop as Element)
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.queryByText('checkout body')).not.toBeNull()
  })

  it('ignores ESC while busy', () => {
    const store = createOnRampSessionsStore()
    store.getState().register('s1', makeSession(true))
    const onClose = vi.fn()
    renderWithI18n(
      <CheckoutModal open={true} onClose={onClose}>
        <div>checkout body</div>
      </CheckoutModal>,
      { wrapper: withProvider(store) }
    )
    fireEvent.keyDown(document.body, { key: 'Escape', code: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.queryByText('checkout body')).not.toBeNull()
  })

  it('closes on backdrop click when idle', () => {
    const store = createOnRampSessionsStore()
    const onClose = vi.fn()
    renderWithI18n(
      <CheckoutModal open={true} onClose={onClose}>
        <div>checkout body</div>
      </CheckoutModal>,
      { wrapper: withProvider(store) }
    )
    const backdrop = document.querySelector('.MuiBackdrop-root')
    fireEvent.click(backdrop as Element)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('confirmation "Yes, leave" calls closePanel; "Stay" does not', async () => {
    const store = createOnRampSessionsStore()
    store.getState().register('s1', makeSession(true))
    const onClose = vi.fn()
    renderWithI18n(
      <CheckoutModal open={true} onClose={onClose}>
        <TriggerConfirmation />
      </CheckoutModal>,
      { wrapper: withProvider(store) }
    )
    fireEvent.click(screen.getByText('trigger-confirm'))
    expect(
      screen.queryByText('Leave with transaction in progress?')
    ).not.toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Stay' }))
    expect(onClose).not.toHaveBeenCalled()
    await waitFor(() =>
      expect(
        screen.queryByText('Leave with transaction in progress?')
      ).toBeNull()
    )

    // Re-open and confirm
    fireEvent.click(screen.getByText('trigger-confirm'))
    fireEvent.click(screen.getByRole('button', { name: 'Yes, leave' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
