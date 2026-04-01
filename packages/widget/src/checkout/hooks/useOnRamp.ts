'use client'
import { useOnRampContext } from '../providers/OnRampProvider/OnRampProvider.js'
import {
  type TransakContextValue,
  useMaybeTransak,
} from '../providers/OnRampProvider/TransakProvider/transakContext.js'
import type { OnRampProviderMeta } from '../providers/OnRampProvider/types.js'

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
