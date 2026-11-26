import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { MetaMaskStellarModule } from './metaMaskStellarModule.js'

// Runs the real SWK MetaMaskModule (and @metamask/connect-stellar's adapter)
// so a renamed adapter event fails here instead of in a user's wallet. Without
// a `location` stub the adapter's session restore fails at once and logs one
// warning, so no transport retries outlive the test.
beforeEach(() => {
  globalThis.window = Object.assign(new EventTarget(), {
    postMessage: vi.fn(),
  }) as unknown as Window & typeof globalThis
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

it('the real MetaMask module still emits the events the wrapper uses', async () => {
  const module = new MetaMaskStellarModule()
  const ended = vi.fn()
  const changed = vi.fn()
  module.onSessionEnd(ended)
  module.onChange(changed)

  const adapter = module.start().adapter
  ;(adapter as unknown as { setAddress(address: string): void }).setAddress(
    'GNEW'
  )
  await vi.waitFor(() =>
    expect(changed).toHaveBeenCalledWith(
      expect.objectContaining({ address: 'GNEW' })
    )
  )

  await adapter.disconnect({ revokeSession: false })
  expect(ended).toHaveBeenCalledTimes(1)
})
