// @vitest-environment happy-dom

import type { OnRampSession } from '@lifi/widget-provider/checkout'
import {
  CheckoutContext,
  createOnRampSessionsStore,
  OnRampSessionsContext,
  type OnRampSessionsStore,
} from '@lifi/widget-provider/checkout'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@lifi/wallet-management', () => ({
  useAccount: () => ({ accounts: [] }),
}))

import { CheckoutModal, useCheckoutModal } from './CheckoutModal.js'
import {
  buildPendingRecord,
  usePendingCheckoutStore,
} from './stores/usePendingCheckoutStore.js'
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

  it('confirmation "Close checkout" calls closePanel; "Cancel" does not', async () => {
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
    expect(screen.queryByText('Leave checkout?')).not.toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onClose).not.toHaveBeenCalled()
    await waitFor(() =>
      expect(screen.queryByText('Leave checkout?')).toBeNull()
    )

    // Re-open and confirm
    fireEvent.click(screen.getByText('trigger-confirm'))
    fireEvent.click(screen.getByRole('button', { name: 'Close checkout' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

describe('CheckoutModal close guard — after funds are sent', () => {
  afterEach(() => {
    usePendingCheckoutStore.getState().clearAll()
  })

  // After TRANSAK_ORDER_SUCCESSFUL the provider session closes and the
  // pending record (written by writeCashSuccess) is what keeps the modal
  // blocked while the deposit is tracked.
  function withRecordProvider(store: OnRampSessionsStore) {
    usePendingCheckoutStore.getState().write(
      'int:0xdeposit',
      buildPendingRecord({
        fundingSource: 'cash',
        depositAddress: '0xdeposit',
        fromChain: 1,
        provider: 'transak',
        status: 'confirmed-no-hash',
      })
    )
    return ({ children }: { children: ReactNode }) => (
      <CheckoutContext.Provider value={{ integrator: 'int' }}>
        <OnRampSessionsContext.Provider value={store}>
          {children}
        </OnRampSessionsContext.Provider>
      </CheckoutContext.Provider>
    )
  }

  it('ignores backdrop clicks with a live pending record and no open session', () => {
    const store = createOnRampSessionsStore()
    store.getState().register('s1', makeSession(false))
    const onClose = vi.fn()
    renderWithI18n(
      <CheckoutModal open={true} onClose={onClose}>
        <div>checkout body</div>
      </CheckoutModal>,
      { wrapper: withRecordProvider(store) }
    )
    const backdrop = document.querySelector('.MuiBackdrop-root')
    expect(backdrop).not.toBeNull()
    fireEvent.click(backdrop as Element)
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.queryByText('checkout body')).not.toBeNull()
  })

  it('ignores ESC with a live pending record and no open session', () => {
    const store = createOnRampSessionsStore()
    store.getState().register('s1', makeSession(false))
    const onClose = vi.fn()
    renderWithI18n(
      <CheckoutModal open={true} onClose={onClose}>
        <div>checkout body</div>
      </CheckoutModal>,
      { wrapper: withRecordProvider(store) }
    )
    fireEvent.keyDown(document.body, { key: 'Escape', code: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.queryByText('checkout body')).not.toBeNull()
  })
})
