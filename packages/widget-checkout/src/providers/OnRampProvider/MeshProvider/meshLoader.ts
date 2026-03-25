import type { LoadedOnRampAdapter } from '../types.js'

/**
 * Mesh on-ramp adapter is not implemented yet.
 * When implemented, dynamically import `@meshconnect/web-link-sdk` here and return a
 * LoadedOnRampAdapter — see `transak/transakLoader.ts` for the pattern.
 */
export async function loadMeshAdapter(): Promise<LoadedOnRampAdapter | null> {
  return null
}
