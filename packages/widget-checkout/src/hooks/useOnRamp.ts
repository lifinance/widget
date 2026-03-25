'use client'
import {
  type TransakContextValue,
  useMaybeTransak,
} from '../onramp/transak/transakContext.js'
import type { OnRampProviderMeta } from '../onramp/types.js'
import { useOnRampContext } from '../providers/OnRampProvider.js'

export interface UseOnRampValues {
  /** True while optional on-ramp peers are being resolved */
  resolutionLoading: boolean
  /** Metadata for on-ramp providers that loaded successfully */
  availableProviders: OnRampProviderMeta[]
  isAvailable: (id: string) => boolean
  /** Transak cash flow; null when the optional peer is missing or failed to load at runtime */
  transak: TransakContextValue | null
}

export function useOnRamp(): UseOnRampValues {
  const onRamp = useOnRampContext()
  const transakCtx = useMaybeTransak()

  return {
    resolutionLoading: onRamp.loading,
    availableProviders: onRamp.availableMetas,
    isAvailable: onRamp.isAvailable,
    transak: transakCtx,
  }
}
