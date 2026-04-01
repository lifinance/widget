import type { LoadedOnRampAdapter } from '../types.js'

/**
 * Transak cash on-ramp is only available when the integrator installs the optional peer
 * `@transak/ui-js-sdk` (declared in this package’s `peerDependencies`; listed under
 * `devDependencies` only so this repo can typecheck and build the checkout package).
 *
 * We dynamically `import()` the SDK first; on failure we skip loading `transakAdapter`, so Transak
 * code does not run at runtime when the peer is missing. The adapter imports the SDK directly for
 * normal typing and bundling; many app bundlers still resolve that async chunk at **build** time, so
 * a missing peer can surface as “module not found” during production builds unless the integrator
 * installs the peer or configures externals.
 */
export async function loadTransakAdapter(): Promise<LoadedOnRampAdapter | null> {
  try {
    await import('@transak/ui-js-sdk')
  } catch {
    return null
  }
  const { createTransakLoadedAdapter } = await import('./TransakProvider')
  return createTransakLoadedAdapter()
}
