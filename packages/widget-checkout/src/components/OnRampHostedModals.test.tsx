// @vitest-environment happy-dom
import {
  createOnRampSessionsStore,
  type OnRampSession,
  OnRampSessionsContext,
} from '@lifi/widget-provider/checkout'
import { act, fireEvent, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithI18n } from '../test/renderWithI18n.js'

vi.mock('@lifi/wallet-management', () => ({
  useAccount: () => ({ accounts: [] }),
}))

vi.mock('@lifi/widget-provider/checkout', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@lifi/widget-provider/checkout')>()
  return {
    ...actual,
    useCheckoutConfig: () => ({ integrator: 'test-int' }),
  }
})

const META = {
  id: 'transak',
  fundingCategory: 'cash' as const,
  name: 'Transak',
  description: '',
  features: [],
}

vi.mock('../providers/OnRampProvider/OnRampProvider.js', () => ({
  useOnRampProviderMetas: () => [META],
}))

vi.mock('./ErrorBoundary.js', () => ({
  ErrorBoundary: ({ children }: { children: ReactNode }) => children,
}))

import { OnRampHostedModals } from './OnRampHostedModals.js'

function makeSession(overrides: Partial<OnRampSession> = {}): {
  session: OnRampSession
  close: ReturnType<typeof vi.fn>
} {
  const close = vi.fn()
  const session = {
    isOpen: true,
    isLoading: false,
    error: null,
    failure: null,
    depositTxHash: null,
    open: vi.fn(),
    close,
    acknowledgeDepositTxHash: vi.fn(),
    mountTargetId: 'transak-mount',
    ...overrides,
  } as unknown as OnRampSession
  return { session, close }
}

function setup(session: OnRampSession) {
  const store = createOnRampSessionsStore()
  store.getState().register(META.id, session)
  const wrapper = ({ children }: { children: ReactNode }) => (
    <OnRampSessionsContext.Provider value={store}>
      {children}
    </OnRampSessionsContext.Provider>
  )
  return { store, ...renderWithI18n(<OnRampHostedModals />, { wrapper }) }
}

describe('OnRampHostedModals — hosted Dialog close guard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('backdrop click does not call session.close', () => {
    const { session, close } = makeSession()
    setup(session)
    const backdrop = document.querySelector('.MuiBackdrop-root')
    expect(backdrop).not.toBeNull()
    fireEvent.click(backdrop as Element)
    expect(close).not.toHaveBeenCalled()
  })

  it('ESC does not call session.close', () => {
    const { session, close } = makeSession()
    setup(session)
    fireEvent.keyDown(document.body, { key: 'Escape', code: 'Escape' })
    expect(close).not.toHaveBeenCalled()
  })

  it('force-close icon is hidden before the 15s grace elapses', () => {
    const { session } = makeSession()
    setup(session)
    act(() => {
      vi.advanceTimersByTime(14_900)
    })
    expect(
      screen.queryByRole('button', { name: "Close (transaction won't resume)" })
    ).toBeNull()
  })

  it('force-close icon appears after 15s with the spec tooltip', () => {
    const { session } = makeSession()
    setup(session)
    act(() => {
      vi.advanceTimersByTime(15_100)
    })
    const btn = screen.getByRole('button', {
      name: "Close (transaction won't resume)",
    })
    expect(btn).not.toBeNull()
  })

  it('clicking force-close calls session.close exactly once', () => {
    const { session, close } = makeSession()
    setup(session)
    act(() => {
      vi.advanceTimersByTime(15_100)
    })
    fireEvent.click(
      screen.getByRole('button', { name: "Close (transaction won't resume)" })
    )
    expect(close).toHaveBeenCalledTimes(1)
  })

  it('the force-close icon is not rendered when session.isOpen is false', () => {
    const { session } = makeSession({ isOpen: false })
    setup(session)
    act(() => {
      vi.advanceTimersByTime(20_000)
    })
    expect(
      screen.queryByRole('button', { name: "Close (transaction won't resume)" })
    ).toBeNull()
  })
})
