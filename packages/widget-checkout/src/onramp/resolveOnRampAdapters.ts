import { loadMeshAdapter } from './mesh/meshLoader.js'
import { loadTransakAdapter } from './transak/transakLoader.js'
import type { LoadedOnRampAdapter } from './types.js'

export async function resolveOnRampAdapters(): Promise<LoadedOnRampAdapter[]> {
  const settled = await Promise.allSettled([
    loadTransakAdapter(),
    loadMeshAdapter(),
  ])

  const adapters: LoadedOnRampAdapter[] = []
  for (const r of settled) {
    if (r.status === 'fulfilled' && r.value) {
      adapters.push(r.value)
    }
  }
  return adapters
}
