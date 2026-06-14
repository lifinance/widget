// @vitest-environment happy-dom
import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithI18n } from '../test/renderWithI18n.js'
import { CloseConfirmationDialog } from './CloseConfirmationDialog.js'

describe('CloseConfirmationDialog', () => {
  it('renders title, body and both buttons when open', () => {
    renderWithI18n(
      <CloseConfirmationDialog
        open={true}
        onCancel={() => {}}
        onConfirm={() => {}}
      />
    )
    expect(screen.queryByText('Leave checkout?')).not.toBeNull()
    expect(
      screen.queryByText(/Closing won't cancel your deposit/)
    ).not.toBeNull()
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeNull()
    expect(
      screen.queryByRole('button', { name: 'Close checkout' })
    ).not.toBeNull()
  })

  it('does not render content when closed', () => {
    renderWithI18n(
      <CloseConfirmationDialog
        open={false}
        onCancel={() => {}}
        onConfirm={() => {}}
      />
    )
    expect(screen.queryByText('Leave checkout?')).toBeNull()
  })

  it('fires onCancel when Stay is clicked', () => {
    const onCancel = vi.fn()
    const onConfirm = vi.fn()
    renderWithI18n(
      <CloseConfirmationDialog
        open={true}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    )
    const stay = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(stay)
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('fires onConfirm when Yes, leave is clicked', () => {
    const onCancel = vi.fn()
    const onConfirm = vi.fn()
    renderWithI18n(
      <CloseConfirmationDialog
        open={true}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Close checkout' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onCancel).not.toHaveBeenCalled()
  })

  it('puts visual emphasis and default focus on Stay', () => {
    renderWithI18n(
      <CloseConfirmationDialog
        open={true}
        onCancel={() => {}}
        onConfirm={() => {}}
      />
    )
    const stay = screen.getByRole('button', { name: 'Cancel' })
    expect(stay.className).toMatch(/MuiButton-contained/)
    expect(document.activeElement).toBe(stay)
  })
})
