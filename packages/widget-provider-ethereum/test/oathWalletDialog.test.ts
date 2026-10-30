// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { openOathConnectionDialog } from '../src/connectors/oathWalletDialog.js'

vi.mock('qrcode', () => ({
  toDataURL: vi.fn(async () => 'data:image/png;base64,fixture'),
}))
const uri = 'wc:fixture@2?relay-protocol=irn&symKey=fixture'
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open')
  }
})
afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})
const root = () => document.querySelector('dialog div')!.shadowRoot!

it('renders a QR directly with instructions, without a second wallet chooser', async () => {
  const cancel = vi.fn()
  const view = await openOathConnectionDialog(
    uri,
    cancel,
    new AbortController().signal
  )
  expect(root().querySelector('.qr')?.getAttribute('alt')).toContain(
    'WalletConnect pairing QR'
  )
  expect(root().textContent).toContain('review and approve')
  expect(root().querySelectorAll('button')).toHaveLength(1)
  view.close()
  expect(cancel).not.toHaveBeenCalled()
})
it('shows an encoded Oath handoff on iOS, without claiming an Android app', async () => {
  vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X)'
  )
  const view = await openOathConnectionDialog(
    uri,
    vi.fn(),
    new AbortController().signal
  )
  expect(root().querySelector('.open')?.getAttribute('href')).toBe(
    `oathwallet://wc?uri=${encodeURIComponent(uri)}`
  )
  expect(root().textContent).not.toContain('Android')
  view.close()
})
it('does not offer an iOS deep link on desktop', async () => {
  vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Desktop Chrome')
  const view = await openOathConnectionDialog(
    uri,
    vi.fn(),
    new AbortController().signal
  )
  expect(root().querySelector('.open')).toBeNull()
  view.close()
})
it('removes pairing data and restores focus on Cancel', async () => {
  const previous = document.createElement('button')
  document.body.append(previous)
  previous.focus()
  const cancel = vi.fn()
  await openOathConnectionDialog(uri, cancel, new AbortController().signal)
  root().querySelector('button')!.click()
  expect(cancel).toHaveBeenCalledOnce()
  expect(document.querySelector('dialog')).toBeNull()
  expect(document.activeElement).toBe(previous)
})
it('handles Escape as cancellation but not programmatic teardown', async () => {
  const cancel = vi.fn()
  const controller = new AbortController()
  await openOathConnectionDialog(uri, cancel, controller.signal)
  document
    .querySelector('dialog')!
    .dispatchEvent(new Event('cancel', { cancelable: true }))
  expect(cancel).toHaveBeenCalledOnce()
  await openOathConnectionDialog(uri, cancel, controller.signal)
  controller.abort()
  expect(cancel).toHaveBeenCalledOnce()
  expect(document.querySelector('dialog')).toBeNull()
})
it('does not open after the pending attempt is already cancelled', async () => {
  const controller = new AbortController()
  controller.abort()
  await expect(
    openOathConnectionDialog(uri, vi.fn(), controller.signal)
  ).rejects.toBeDefined()
  expect(document.querySelector('dialog')).toBeNull()
})
it('rejects unrelated or malformed connection URLs', async () => {
  await expect(
    openOathConnectionDialog(
      'https://example.com',
      vi.fn(),
      new AbortController().signal
    )
  ).rejects.toThrow('Invalid WalletConnect')
})
