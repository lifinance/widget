import { loadMeshAdapter } from './MeshProvider/meshLoader.js'
import { loadTransakAdapter } from './TransakProvider/transakLoader.js'
import type { LoadedOnRampAdapter } from './types.js'

const adapterNames = ['transak', 'mesh'] as const

export async function resolveOnRampAdapters(): Promise<LoadedOnRampAdapter[]> {
  const settled = await Promise.allSettled([
    loadTransakAdapter(),
    loadMeshAdapter(),
  ])

  // On-ramp providers are optional peer deps. If a provider's SDK isn't
  // installed (or fails to load), we intentionally drop it from the list so
  // the UI simply doesn't render that funding option — no user-facing error.
  // The warn is dev-only signal for integrators debugging a missing install.
  const adapters: LoadedOnRampAdapter[] = []
  for (let i = 0; i < settled.length; i++) {
    const r = settled[i]
    if (r.status === 'fulfilled' && r.value) {
      adapters.push(r.value)
    } else if (r.status === 'rejected') {
      console.warn(
        `[LifiWidgetCheckout] On-ramp adapter "${adapterNames[i]}" failed to load:`,
        r.reason
      )
    }
  }
  return adapters
}
