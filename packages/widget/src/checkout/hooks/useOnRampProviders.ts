'use client'
import {
  type OnRampProviderInfo,
  useOnRampProviderMetas,
} from '../providers/OnRampProvider/OnRampProvider.js'

export interface UseOnRampProvidersResult {
  /** Metadata for every provider passed via `onRampProviders`. */
  available: OnRampProviderInfo[]
  /** True if a provider with this id was registered. */
  isAvailable: (id: string) => boolean
}

export function useOnRampProviders(): UseOnRampProvidersResult {
  const metas = useOnRampProviderMetas()
  return {
    available: metas,
    isAvailable: (id) => metas.some((m) => m.id === id),
  }
}
