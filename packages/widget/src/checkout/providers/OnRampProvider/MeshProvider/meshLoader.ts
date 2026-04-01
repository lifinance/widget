import type { LoadedOnRampAdapter } from '../types.js'

/**
 * Mesh CEX on-ramp is only available when the integrator installs the optional peer
 * `@meshconnect/web-link-sdk` (declared in this package's `peerDependencies`).
 * Dynamic import of the SDK first; on failure returns null so the adapter is silently
 * skipped and the "Connect Exchange" card remains in "Coming Soon" state.
 */
export async function loadMeshAdapter(): Promise<LoadedOnRampAdapter | null> {
  try {
    await import('@meshconnect/web-link-sdk')
  } catch {
    return null
  }
  const { createMeshLoadedAdapter } = await import('./MeshProvider.js')
  return createMeshLoadedAdapter()
}
