// @vitest-environment happy-dom
import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithI18n } from '../test/renderWithI18n.js'
import { ConfirmationBottomSheet } from './ConfirmationBottomSheet.js'

describe('ConfirmationBottomSheet', () => {
  it('renders title, body and both labels when open', () => {
    renderWithI18n(
      <ConfirmationBottomSheet
        open
        onCancel={() => {}}
        onConfirm={() => {}}
        title="Are you sure?"
        body="This will reset things."
        cancelLabel="No"
        confirmLabel="Yes"
      />
    )
    expect(screen.queryByText('Are you sure?')).not.toBeNull()
    expect(screen.queryByText('This will reset things.')).not.toBeNull()
    expect(screen.queryByRole('button', { name: 'No' })).not.toBeNull()
    expect(screen.queryByRole('button', { name: 'Yes' })).not.toBeNull()
  })

  it('does not render content when closed', () => {
    renderWithI18n(
      <ConfirmationBottomSheet
        open={false}
        onCancel={() => {}}
        onConfirm={() => {}}
        title="Are you sure?"
        body="This will reset things."
        cancelLabel="No"
        confirmLabel="Yes"
      />
    )
    expect(screen.queryByText('Are you sure?')).toBeNull()
  })

  it('fires onCancel when cancel is clicked', () => {
    const onCancel = vi.fn()
    const onConfirm = vi.fn()
    renderWithI18n(
      <ConfirmationBottomSheet
        open
        onCancel={onCancel}
        onConfirm={onConfirm}
        title="t"
        body="b"
        cancelLabel="Cancel"
        confirmLabel="OK"
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('fires onConfirm when confirm is clicked', () => {
    const onCancel = vi.fn()
    const onConfirm = vi.fn()
    renderWithI18n(
      <ConfirmationBottomSheet
        open
        onCancel={onCancel}
        onConfirm={onConfirm}
        title="t"
        body="b"
        cancelLabel="Cancel"
        confirmLabel="OK"
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'OK' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onCancel).not.toHaveBeenCalled()
  })

  it('puts default focus and visual emphasis on the cancel button', () => {
    renderWithI18n(
      <ConfirmationBottomSheet
        open
        onCancel={() => {}}
        onConfirm={() => {}}
        title="t"
        body="b"
        cancelLabel="Stay"
        confirmLabel="Leave"
      />
    )
    const stay = screen.getByRole('button', { name: 'Stay' })
    expect(stay.className).toMatch(/MuiButton-contained/)
    expect(document.activeElement).toBe(stay)
  })
})
